import {
  PublicKey,
  PrivateKey,
  Identity,
  ThreadID,
  UserMessage,
  Users,
} from '@textile/hub'
import { Query } from '@textile/threads-client'
import {
  ConversationQuery,
  DecryptedMessage,
  MailboxCallback,
  MessageFromThread,
  MailboxSubscriptionType,
  MessageCallback,
} from '~/types/textile/mailbox'
import { TextileInitializationData } from '~/types/textile/manager'
export class MailboxManager {
  senderAddress: string
  textile: TextileInitializationData
  mailboxID: string
  listeners: {
    inbox?: MailboxCallback
    sentbox?: MailboxCallback
  }

  constructor(textile: TextileInitializationData, senderAddress: string) {
    this.textile = textile
    this.mailboxID = ''
    this.senderAddress = senderAddress
    this.listeners = {}
  }

  /**
   * @method init
   * @description Initializes the mailbox for the current user
   */
  async init() {
    const users: Users = this.textile.users
    this.mailboxID = await users.setupMailbox()
  }

  /**
   * @method buildMessage
   * @description Generates a Message object from the given data
   * @param to Destination address
   * @param type Message type
   * @param data message data
   * @returns a Message Object
   */
  buildMessage(to: string, type: string, data: any) {
    return {
      sender: this.senderAddress,
      to,
      at: Date.now(),
      type,
      payload: data,
    }
  }

  /**
   * @method getConversation
   * Retrieve a conversation with a specific user, filtered by the given query parameters
   * @param friendIdentifier friend mailboxId
   * @param query parameters for filtering
   * @returns an array of messages
   */
  async getConversation(
    friendIdentifier: string,
    query: ConversationQuery
  ): Promise<DecryptedMessage[]> {
    const thread = await this.textile.users.getThread('hubmail')
    const threadID = ThreadID.fromString(thread.id)

    const inboxQuery = Query.where('from').eq(friendIdentifier).orderByIDDesc()

    if (query?.limit) {
      inboxQuery.limitTo(query.limit)
    }

    if (query?.skip) {
      inboxQuery.skipNum(query.skip)
    }

    const encryptedInbox = await this.textile.client.find<any>(
      threadID,
      MailboxSubscriptionType.inbox,
      inboxQuery
    )

    const lastMessageTime = encryptedInbox?.[0]?.created_at || 0
    const firstMessageTime =
      encryptedInbox?.[encryptedInbox.length - 1]?.created_at || 0

    const sentboxQuery = Query.where('to')
      .eq(friendIdentifier)
      .and('created_at')
      .ge(firstMessageTime)

    if (query?.skip && query.skip > 0) {
      sentboxQuery.and('created_at').lt(lastMessageTime)
    }

    const encryptedSentbox = await this.textile.client.find<any>(
      threadID,
      MailboxSubscriptionType.sentbox,
      sentboxQuery
    )

    const messages = [...encryptedInbox, ...encryptedSentbox].sort(
      (a, b) => a.created_at - b.created_at
    )

    return Promise.all<DecryptedMessage>(messages.map<any>(this.decodeMessage))
  }

  /**
   * @method buildCallback
   * Generates a MailboxCallback from MessageCallback and the unsubscribe function
   * @param onMessage the callback for the onMessage event
   * @param onUnsubscribe the event to be fired when the Textile subscription is closed
   * @returns the generated MailboxCallback
   */
  buildCallback(
    onMessage: MessageCallback,
    onUnsubscribe: CallableFunction
  ): MailboxCallback {
    return (reply, err) => {
      // If the reply is undefined means that the subscription
      // has been closed by the Textile library
      if (reply === undefined && err === undefined) {
        onUnsubscribe()
        return
      }

      if (reply?.message) {
        this.decodeMessage(userMessageToThread(reply?.message)).then(
          (decrypted) => {
            onMessage(decrypted)
          }
        )
      }
    }
  }

  /**
   * @method listenToInboxMessages
   * @description Starts a watcher on inbox messages
   * @param onMessage Callback function to be called
   */
  listenToInboxMessages(onMessage: MessageCallback) {
    this.listeners.inbox = this.buildCallback(onMessage, () => {
      delete this.listeners.inbox
    })

    this.textile.users.watchInbox(this.mailboxID, this.listeners.inbox)
  }

  /**
   * @method listenToSentboxMessages
   * @description Starts a watcher on Sentbox messages
   * @param onMessage Callback function to be called
   */
  listenToSentboxMessages(onMessage: MessageCallback) {
    this.listeners.sentbox = this.buildCallback(onMessage, () => {
      delete this.listeners.sentbox
    })

    this.textile.users.watchSentbox(this.mailboxID, this.listeners.sentbox)
  }

  /**
   * @method sendMessage
   * @description Sends a message to the given recipient
   * @param to Recipient
   * @param message Message to be sent
   */
  sendMessage(to: string, message: string) {
    const recipient: PublicKey = PublicKey.fromString(to)

    const encoder = new TextEncoder()
    const body = encoder.encode(message)
    return this.textile.users.sendMessage(
      this.textile.identity,
      recipient,
      body
    )
  }

  /**
   * @method decodeMessage
   * @description Internal function used to decode messages
   * @param message Message to be decoded
   */
  decodeMessage = async (
    message: MessageFromThread
  ): Promise<DecryptedMessage> => {
    const identity: Identity = this.textile.identity
    const privKey = PrivateKey.fromString(identity.toString())

    // eslint-disable-next-line camelcase
    const { _id, from, read_at, created_at } = message
    const msgBody = Buffer.from(message.body, 'base64')

    const bytes = await privKey.decrypt(msgBody)
    const decoded = new TextDecoder().decode(bytes)
    const body = JSON.parse(decoded)

    return { body, from, readAt: read_at, sent: created_at, id: _id }
  }

  /**
   * @method isInitialized
   * @description Checks if the mailbox is initialized for the current user
   * @returns true | false
   */
  isInitialized() {
    return this.mailboxID !== ''
  }

  /**
   * @method isSubscribed
   * @description Checks if the subscription for the given type is active
   * @param type Subscription type 'inbox' | 'sentbox'
   * @returns true | false
   */
  isSubscribed(type: MailboxSubscriptionType): boolean {
    return Boolean(this.listeners[type])
  }
}

/**
 * @function userMessageToThread
 * Converts the UserMessage type into its threadDB representation
 * @param message the user message to convert
 * @returns the converted message
 */
function userMessageToThread(message: UserMessage): MessageFromThread {
  const { body, createdAt, from, id, readAt, signature, to } = message
  return {
    _id: id,
    body: Buffer.from(body).toString('base64'),
    created_at: createdAt,
    read_at: readAt,
    _mod: createdAt,
    from,
    signature: Buffer.from(signature).toString('base64'),
    to,
  }
}