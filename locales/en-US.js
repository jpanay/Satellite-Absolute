export default {
  global: {
    settings: 'Settings',
    copied: 'ATTN: Copied to clipboard.',
  },
  pages: {
    unlock: {
      decrypt: 'Decrypt Account',
      create: 'Create Account Pin',
      placeholder: 'Enter Pin...',
      store_pin: 'Store Pin? (Less Secure)',
      invalid_pin: 'Pin must be at least 5 characters.',
    },
    loading: {
      loading: 'Linking Satellites...',
    },
    disclaimer: {
      title: 'Account Creation',
      subtitle:
        "We're going to create an account for you. On the next screen you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
      create: 'Create Account',
      or: 'Or',
      import: 'Import Account',
    },
    phrase: {
      title: 'Recovery Seed',
      done: 'I Saved It',
      write_down: 'Write this down.',
    },
    settings: {
      audio: {
        input: {
          title: 'Audio Input',
          subtitle:
            "Select which input device you'd like people to hear your silky smooth voice from.",
        },
        output: {
          title: 'Audio Output',
          subtitle:
            "Select the device that you'd like to deliver sound to your ear holes with.",
        },
        bitrate: {
          title: 'Audio Bitrate',
          subtitle:
            'Higher bitrates will transmit better quality audio, lowering the bitrate can help with slower connection speeds.',
        },
        sampleSize: {
          title: 'Sample Size',
          subtitle:
            'A higher sample size will give you a broader dynamic range of audio. Higher samples require better connections.',
        },
        echo: {
          title: 'Echo Cancellation',
          subtitle:
            'Enable to help cancel out some slight echo & feedback from your mic.',
        },
        noise: {
          title: 'Noise Suppression',
          subtitle: 'Enable to help hide background noise in your environment.',
        },
      },
      keybinds: {
        title: 'Default Keybinds',
        subtitle:
          'A list of the default keybinds for quickly navigating and using Satellite.',
        mute: 'Toggle Mute',
        settings: 'Open Settings',
        deafen: 'Toggle Deafen',
        call: 'Call Active Chat',
      },
      accounts: {
        title: 'Accounts & Devices',
        subtitle:
          "Select with account you'd prefer to default transactions from.",
        active: 'Active Account',
        gas_price: 'Transaction Fee Limit',
        devices: 'Connected Devices',
        no_devices: 'No connected devices found.',
      },
      personalize: {
        title: 'Personalize Satellite',
        subtitle: 'Make it your own and chose cusotm colors & themes.',
        theme: 'Color Theme',
        language: 'Language',
      },
      network: {
        title: 'Network',
        subtitle:
          'Customize the chain Satellite will operate on. You can also choose different networks. Please note that any network other than Testnet will operate with REAL funds.',
        chain: 'Blockchain',
        network: 'Network',
      },
      storage: {
        title: 'Storage',
        subtitle:
          'Control how your data is stored. You can export your local storage information as well as reset Satellite here. Be careful resetting your local storage will clear out your account.',
        clear: {
          title: 'Clear Storage',
          subtitle:
            'Reset Satellite. This will clear any saved accounts. Do not do this without backing up your account first.',
          button: 'Clear Local Storage',
        },
        export: {
          title: 'Export Storage',
          subtitle:
            "Export your local storage, it's your data you can do whatever you'd like with it.",
          button: 'Export Local Storage',
        },
      },
      profile: {
        title: 'Profile',
        subtitle: 'Update your profile photo, status, banners and more.',
        info: {
          title: 'Account Info',
          subtitle:
            'Below is a list of helpful information regaurding your account.',
          accountID: 'Account Identifier',
        },
        phrase: {
          title: 'Recovery Phrase',
          subtitle:
            'Do not share this phrase with anyone. This phrase is used to recover your account. Anyone with access to this has access to your account.',
        },
      },
    },
  },
}