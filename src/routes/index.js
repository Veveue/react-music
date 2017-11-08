import Loadable from 'react-loadable'
import MainView from 'views/MainView'
import SyncView from 'views/SyncView'
import recommend from 'views/recommend'
import Singer from 'views/singer'

const AsyncView = Loadable({
  loader: () => import('views/AsyncView'),
  // if you have your own loading component,
  // you should consider add it here
  loading: () => null
})

export default [
  {
    path: '/',
    component: MainView,
    redirectTo: '/recommend',
    childRoutes: [
      {
        path: '/sync',
        component: SyncView
      },
      {
        path: '/async',
        component: AsyncView
      },
      {
        path: '/recommend',
        component: recommend
      },
      {
        path: '/singer',
        component: Singer
      }
    ]
  }
]
