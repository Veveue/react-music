import React from 'react'
import './index.styl'
class SearchBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
  }
  clear = () => {
    this.setState({query: ''})
  }
  blur = () => {
    this.$refs.query.blur()
  }
  handleChange = (event) => {
    console.log(event.target.value)
    this.setState({query: event.target.value})
  }
  componentWillUnmount () {
  }
  componentWillMount () {
  }
  componentDidMount () {

  }
  render () {
    return (
      <div className='search-box'>
        <i className='icon-search' />
        <input ref='query' value={this.state.query} onChange={this.handleChange} className='box' placeholder='搜索歌曲、歌手' />
        <i className='icon-dismiss' style={{display: this.state.query ? '' : 'none'}} onClick={this.clear} />
      </div>
    )
  }
}

export default SearchBox
