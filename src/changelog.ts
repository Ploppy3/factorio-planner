

export interface Version {
    name: string;
    changes: string[];
};

export const Versions: Version[] = [
    {
        name: 'Version 2.7.3 - 2021/01/31',
        changes: [
            'Add Factorio versions 1.1.19 and 1.1.19-marathon',
        ]
    },
    {
        name: 'Version 2.7.3 - 2020/06/17',
        changes: [
            'Add Factorio versions 1.0.0 and 1.0.0-marathon',
        ]
    },
    {
        name: 'Version 2.7.0 - 2020/06/17',
        changes: [
            'Import custom game version',
        ]
    },
    {
        name: 'Version 2.6.0 - 2020/06/15',
        changes: [
            'Tabs are saved and reloaded when the app starts/closes',
        ]
    },
    {
        name: 'Version 2.5.0 - 2020/06/13',
        changes: [
            'Added Factorio v18 and v18-marathon version',
            'Fixed size of icons',
        ]
    },
    {
        name: 'Version 2.4.0',
        changes: [
            'Added tabs',
        ]
    },
    {
        name: 'Version 2.3.0',
        changes: [
            'Updated Factorio v16 version',
            'Dark-Theme option is now saved',
            'Many visual improvements and fixes',
        ]
    },
    {
        name: 'Version 2.2.0',
        changes: [
            'Improved performance',
        ]
    },
    {
        name: 'Version 2.1.0',
        changes: [
            'Added Factorio v16+Bob version',
            'Added Dark theme option',
        ]
    },
    {
        name: 'Version 2.0.0',
        changes: [
            'Added Factorio v16 and v16 marathon',
            'Added tooltip on images',
        ]
    },
    {
        name: 'Version 1.5.0',
        changes: [
            'Fixed broken images',
        ]
    },
    {
        name: 'Version 1.4.0',
        changes: [
            'Added Resource Overview',
            'Improved performance',
        ]
    },
    {
        name: 'Version 1.3.0',
        changes: [
            'Added global settings for crafting machines',
            'Improved performance',
        ]
    },
    {
        name: 'Version 1.2.0',
        changes: [
            'Added new highly requested Tree View',
            'Added ability to minimize nodes by clicking on their icons',
            'Added new time units',
        ]
    },
    {
        name: 'Version 1.1.0',
        changes: [
            'Added expensive recipes (marathon)',
        ]
    },
    {
        name: 'Version 1.0.0',
        changes: [
            'Initial release test',
        ]
    },
];
