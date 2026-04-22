/** @type {import('@docusaurus/plugin-content-docs').SidebarConfig} */
export default [
  {
    type: 'category',
    label: 'security',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'guide/security/overview',
        label: 'Security',
      },
      {
        type: 'doc',
        id: 'guide/security/customizing-post-authentication-handlers',
        label: 'Customize Post-Authentication Handlers',
      },
    ],
  },

  {
    type: 'category',
    label: 'components',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'guide/components/overview',
        label: 'Components',
      },
    ],
  },

  {
    type: 'category',
    label: 'deployement',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'guide/deployement/overview',
        label: 'Deployement',
      },
    ],
  },

  {
    type: 'category',
    label: 'app-solutions',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'guide/app-solutions/overview',
        label: 'App Solutions',
      },
    ],
  },

  {
    type: 'category',
    label: 'layouting-and-styling',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'guide/layouting-and-styling/overview',
        label: 'Layouting and Styling',
      },
    ],
  },

  {
    type: 'category',
    label: 'variables',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'guide/variables/overview',
        label: 'Variables',
      },
    ],
  },

  {
    type: 'category',
    label: 'integration',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'guide/integration/overview',
        label: 'Integration',
      },
      {
        type: 'doc',
        id: 'guide/integration/set-up-wavemaker-project-locally',
        label: 'Local Setup with Workspace Sync',
      },
    ],
  },

  {
    type: 'category',
    label: 'java-services',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'guide/java-services/schedule-java-service',
        label: 'Schedule a Java Service',
      },
    ],
  },

  {
    type: 'category',
    label: 'react-native',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        id: 'guide/react-native/store-credentials-with-secure-store',
        label: 'Secure Store',
      },
    ],
  },
];
