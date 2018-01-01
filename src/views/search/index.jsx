import React from 'react'
import SearchBox from 'components/search-box/'

import './index.styl'
class Search extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount () {
  }
  render () {
    return (
      <div className='search'>
        <div className='search-box-wrapper'>
          <SearchBox ref='searchBox' />
        </div>
      </div>
    )
  }
}
export default Search
