const drawerWidth = 240;

export const mainLayoutStyles = {
  appBar: {
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    ml: { sm: `${drawerWidth}px` },
  },
  menuButton: {
    mr: 2,
    display: { sm: 'none' },
  },
  nav: {
    width: { sm: drawerWidth },
    flexShrink: { sm: 0 },
  },
  temporaryDrawer: {
    display: { xs: 'block', sm: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
    },
  },
  permanentDrawer: {
    display: { xs: 'none', sm: 'block' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
    },
  },
  main: {
    flexGrow: 1,
    p: 3,
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    mt: { xs: 7, sm: 8 },
  },
}; 