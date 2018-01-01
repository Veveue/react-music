import Loadable from 'react-loadable'
import MainView from 'views/MainView'
import SyncView from 'views/SyncView'
import recommend from 'views/recommend'
import Search from 'views/search'
import Rank from 'views/rank'
import Singer from 'views/singer'
import TopList from 'components/top-list'
import SingerDetail from 'views/singerDetail'

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
    IndexRedirectTo: '/recommend',
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
        path: '/search',
        component: Search
      },
      {
        path: '/recommend',
        component: recommend
      },
      {
        path: '/rank',
        component: Rank,
        childRoutes: [
          {
            path: '/rank/:id',
            component: TopList
          }]
      },
      {
        path: '/singer',
        component: Singer,
        childRoutes: [
          {
            path: '/singer/:id',
            component: SingerDetail
          }]
      }
    ]
  }
]
