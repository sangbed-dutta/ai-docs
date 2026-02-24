/** @type {import('@docusaurus/plugin-content-docs').SidebarConfig} */
export default [
  {
    type: 'category',
    label: 'Concepts',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'user-interfaces/mobile/concepts/overview',
      },
      {
        type: 'doc',
        id: 'user-interfaces/mobile/concepts/tech-stack',
      },
    ],
  },
  {
    type: 'category',
    label: 'Components',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'user-interfaces/mobile/components/mobile-components',
        label: 'Mobile Components',
      },
    ],
  },
  {
    type: 'category',
    label: 'Develop',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'category',
        label: 'Create Web App',
        collapsible: true,
        collapsed: true,
        link: {
          type: 'doc',
          id: 'user-interfaces/mobile/develop/create-web-app-project/index',
        },
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/create-web-app-project/project-structure',
            label: 'Project structure',
          },
          {
            type: 'category',
            label: 'Generated Code',
            collapsible: true,
            collapsed: true,
            items: [
              {
                type: 'doc',
                id: 'user-interfaces/mobile/develop/create-web-app-project/angular-project-structure',
                label: 'Angular',
              },
              {
                type: 'doc',
                id: 'user-interfaces/mobile/develop/create-web-app-project/react-project-structure',
                label: 'React',
              },
            ],
          },
        ],
      },
      {
        type: 'category',
        label: 'Create a page',
        collapsible: true,
        collapsed: true,
        link: {
          type: 'doc',
          id: 'user-interfaces/mobile/develop/page/index',
        },
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/page/properties',
            label: 'Properties & Behaviour',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/page/types',
            label: 'Types',
          },
        ],
      },
      {
        type: 'category',
        label: 'Working with Layouts',
        collapsible: true,
        collapsed: true,
        link: {
          type: 'doc',
          id: 'user-interfaces/mobile/develop/working-with-layouts/index',
        },
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/working-with-layouts/auto-layout',
            label: 'Auto Layout',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/working-with-layouts/component-with-layouting-features',
            label: 'Component with Layouting features',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/working-with-layouts/responsive-design-with-layouts',
            label: 'Responsive Design with Layouts',
          },
        ],
      },
      {
        type: 'category',
        label: 'Styling with Design Tokens',
        collapsible: true,
        collapsed: true,
        link: {
          type: 'doc',
          id: 'user-interfaces/mobile/develop/styling-with-design-tokens/index',
        },
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/styling-with-design-tokens/introduction-to-foundation-css',
            label: 'Introduction to Foundation CSS',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/styling-with-design-tokens/customising-your-application',
            label: 'Customising your Application',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/styling-with-design-tokens/editing-foundation-css',
            label: 'Editing Foundation CSS',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/styling-with-design-tokens/overview',
            label: 'Styling with Design Tokens',
          },
        ],
      },
      {
        type: 'category',
        label: 'Integrating with APIs',
        collapsible: true,
        collapsed: true,
        link: {
          type: 'doc',
          id: 'user-interfaces/mobile/develop/integrating-with-apis/index',
        },
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/integrating-with-apis/variables',
            label: 'Variables',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/integrating-with-apis/life-cycle-hooks',
          },
        ],
      },
      {
        type: 'category',
        label: 'Component behaviour & methods',
        collapsible: true,
        collapsed: true,
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/component-behaviour-and-methods/common-properties',
            label: 'Common properties',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/component-behaviour-and-methods/javascript-access',
            label: 'JavaScript access methods',
          },
        ],
      },
      {
        type: 'category',
        label: 'Validations',
        collapsible: true,
        collapsed: true,
        link: {
          type: 'doc',
          id: 'user-interfaces/mobile/develop/form-input-validations/index',
        },
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/form-input-validations/custom-validators-in-javascript',
            label: 'Custom validators in JavaScript',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/form-input-validations/bind-expressions',
            label: 'Bind expressions',
          },
        ],
      },

      {
        type: 'category',
        label: 'Event Handling',
        collapsible: true,
        collapsed: true,
        link: {
          type: 'doc',
          id: 'user-interfaces/mobile/develop/events/index',
        },
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/events/app-page-events',
            label: 'App and Page Events',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/events/variable-events',
            label: 'Variable Events',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/events/ui-events',
            label: 'UI Component Events',
          },
        ],
      },
      {
        type: 'category',
        label: 'Actions',
        collapsible: true,
        collapsed: true,
        link: {
          type: 'doc',
          id: 'user-interfaces/mobile/develop/actions/index',
        },
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/develop/actions/types',
            label: 'Types',
          },
        ],
      },
    ],
  },
  {
    type: 'category',
    label: 'Enterprise capabilities',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'user-interfaces/mobile/enterprise-capabilities/accessibility',
      },
      {
        type: 'doc',
        id: 'user-interfaces/mobile/enterprise-capabilities/language-support-i18n',
      },
      {
        type: 'category',
        label: 'prefabs',
        collapsible: true,
        collapsed: true,
        items: [
          // {
          //   type: 'doc',
          //   id: 'user-interfaces/mobile/enterprise-capabilities/prefabs/wmx-components-mobile',
          // },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/enterprise-capabilities/prefabs/overview',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/enterprise-capabilities/prefabs/create-prefab',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/enterprise-capabilities/prefabs/publishing',
          },
        ],
      },
      {
        type: 'category',
        label: 'WMX Components',
        collapsible: true,
        collapsed: true,
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/enterprise-capabilities/wmx/wmx-components',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/enterprise-capabilities/wmx/wmx-schema-reference',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/enterprise-capabilities/wmx/wmx-with-aira',
          },
        ],
      },
      //   {
      //     type: 'doc',
      //     id: 'user-interfaces/mobile/enterprise-capabilities/prefabs',
      //   },
      //   {
      //     type: 'doc',
      //     id: 'user-interfaces/mobile/enterprise-capabilities/role-based-access-control',
      //   },
    ],
  },

  {
    type: 'category',
    label: 'Testing & Debugging',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'user-interfaces/mobile/testing-and-debugging/debugging-overview',
        label: 'Debugging Overview',
      },
      {
        type: 'category',
        label: 'Community Debugging Tools',
        collapsible: true,
        collapsed: true,
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/community-debugging-tools/chrome-devtools',
            label: 'Chrome DevTools',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/community-debugging-tools/react-devtools',
            label: 'React DevTools',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/community-debugging-tools/react-native-devtools',
            label: 'React Native DevTools',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/community-debugging-tools/expo-dev-tools',
            label: 'Expo Dev Tools',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/community-debugging-tools/flipper',
            label: 'Flipper (Deprecated)',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/community-debugging-tools/reactotron',
            label: 'Reactotron',
          },
        ],
      },
      {
        type: 'category',
        label: 'WaveMaker Debugging Tools',
        collapsible: true,
        collapsed: true,
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/wm-debugging-tools/wavepulse',
            label: 'WavePulse',
          },
        ],
      },
      {
        type: 'category',
        label: 'Testing Strategies',
        collapsible: true,
        collapsed: true,
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/testing-strategies/ui-testing-mobile',
          },
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/testing-strategies/automate-testing',
          },
        ],
      },
      {
        type: 'category',
        label: 'Unit Testing',
        collapsible: true,
        collapsed: true,
        items: [
          {
            type: 'doc',
            id: 'user-interfaces/mobile/testing-and-debugging/unit-testing/web-and-mobile',
          },
        ],
      },
    ],
  },
  {
    type: 'category',
    label: 'device-capabilities-mobile',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'user-interfaces/mobile/device-capabilities-mobile/adding-plugins',
      },
      {
        type: 'doc',
        id: 'user-interfaces/mobile/device-capabilities-mobile/enabling-gestures',
      },
      {
        type: 'doc',
        id: 'user-interfaces/mobile/device-capabilities-mobile/offline-support',
      },
    ],
  },
];
