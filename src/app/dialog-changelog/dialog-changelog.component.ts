import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-changelog',
  templateUrl: './dialog-changelog.component.html',
  styleUrls: ['./dialog-changelog.component.css']
})
export class DialogChangelogComponent implements OnInit {

  public versions: Version[] = [
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

  constructor() { }

  ngOnInit() {
  }

}

interface Version {
  name: string;
  changes: string[];
}
