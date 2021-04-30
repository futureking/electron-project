import { Menu, MenuItemConstructorOptions } from 'electron';

const template: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
      },
      { type: 'separator' },
      {
        label: 'Open',
      },
      {
        label: 'Open Recent...',
      },
      { type: 'separator' },
      {
        label: 'Save Project',
      },
      { type: 'separator' },

      {
        label: 'Save',
      },
      {
        label: 'Save as...',
      },
      { 
        label: 'Import',
        submenu: [
          {
            label: 'Import .He',
          },
          { label: 'Import .Wav' },
        ]
      },
      { 
        label: 'Export',
        submenu: [
          {
            label: 'Export .He',
          }
        ]
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { label: 'Duplicate' },
    ],
  },
  {
    label: 'Add',
    submenu: [
      { label: 'Transient' },
      { label: 'Continuous' },
      { label: 'Audio' },
      { label: 'Video' },
      { type: 'separator' },
      { label: 'Effect' },
      { type: 'separator' },
      { label: 'From Library' }
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'togglefullscreen' },
      {
        label: 'Basic Panel',
        type: 'checkbox',
        checked: true,
      },
      {
        label: 'Library Panel',
        type: 'checkbox',
        checked: true,
      },
      {
        label: 'Properites Panel',
        type: 'checkbox',
        checked: true,
      },
      { type: 'separator' },
      {
        label: 'Zoom in',
      },
      {
        label: 'Zoom out',
      }
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }],
  },
  {
    label: 'About',
  },
];

// if (process.platform === 'darwin') {
//   template.unshift({
//     label: app.getName(),
//     submenu: [
//       {
//         role: 'about',
//         label: 'about',
//       },
//       {
//         type: 'separator',
//       },
//       {
//         label: 'preferences',
//       },
//       {
//         type: 'separator',
//       },
//       {
//         role: 'quit',
//         label: 'quit',
//       },
//     ],
//   });
// }

export default function() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

