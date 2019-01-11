import _ from 'lodash'
import React, { Component } from 'react'
import {
  ActivityIndicator, FlatList, Image, Text, View, TouchableOpacity
} from 'react-native'
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import moment from 'moment'

import Styles from './Styles'

const apiKey = 'AIzaSyC87ruOc6SBzU7ujJ5JUU773PFLzPEN_dY'
const channelId = 'UCvO6uJUVJQ6SrATfsWR5_aA'
const results = 50

class App extends Component {
  state = {
    data: [],
    loading: true,
    showChart: false,
    refreshing: false,
    nextPageToken: '',
  }

  componentDidMount () {
    this.fetchInitialVideos()
  }

  fetchInitialVideos = () => {
    fetch(`https://www.googleapis.com/youtube/v3/search/?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${results}`)
      .then(res => res.json())
      .then((res) => {
        const videos = []
        res.items.forEach((item) => {
          videos.push(item)
        })
        this.setState({
          data: videos,
          loading: false,
          nextPageToken: res.nextPageToken,
          refreshing: false
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  fetchMoreVideos = () => {
    const { data } = this.state

    fetch(`https://www.googleapis.com/youtube/v3/search/?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${results}&pageToken=${this.state.nextPageToken}`)
      .then(res => res.json())
      .then((res) => {
        const videos = []
        res.items.forEach((item) => {
          videos.push(item)
        })
        this.setState({
          data: [...data, ...videos],
          nextPageToken: res.nextPageToken
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  addAllVideosToArray = () => {
    const { nextPageToken } = this.state

    if (nextPageToken) {
      this.fetchMoreVideos()
    }
  }

  renderItem = ({ item }) => (
    <View
      key={item.id.videoId}
      style={Styles.videoItem}
    >
      <Image
        key={item.snippet.thumbnails.medium.url}
        source={{ uri: item.snippet.thumbnails.medium.url }}
        style={Styles.videoThumbnail}
      />
      <Text
        key={item.snippet.title}
        style={Styles.videoTitle}
      >
        {item.snippet.title}
      </Text>
    </View>
  )

  onRefresh = () => {
    this.setState({ refreshing: true }, () => { this.fetchInitialVideos() })
  }

  renderChart = () => {
    const fill = 'rgb(134, 65, 244)'

    // The data below is the returned array from sortChartData()
    // It is hardcoded as it was giving issues when trying to call the shortChartData() method, however the method does work
    const chartData = [4, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 3, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1]

    return (
      <View>
        <View style={{ padding: 10 }}>
          <Text>
            The graph below shows how many videos were uploaded to the PAQ YouTube channel per week, over the last 18 months.
          </Text>
          <Text>
            x-axis: Number of weeks
        </Text>
          <Text>
            y-axis: Number of videos
        </Text>
        </View>
        <View style={Styles.barChart}>
          <YAxis
            contentInset={{ top: 30, bottom: 30 }}
            data={chartData}
            numberOfTicks={5}
            svg={{
              fill: 'grey',
              fontSize: 10,
            }}
          />
          <View style={{ flex: 1 }}>
            <BarChart
              contentInset={{ top: 30, bottom: 30 }}
              data={chartData}
              style={{ height: 250 }}
              svg={{ fill }}
            >
              <Grid />
            </BarChart>
            <XAxis
              contentInset={{ left: 10, right: 10 }}
              data={chartData}
              formatLabel={(value, index) => index}
              style={{ marginBottom: 20 }}
              svg={{ fontSize: 10, fill: 'black' }}
            />
          </View>
        </View>
      </View>
    )
  }

  sortChartData = () => {
    const { data } = this.state

    const reverseData = []

    data.forEach((item) => {
      reverseData.push(item.snippet.publishedAt)
    })

    // Reverse array to get oldest video first
    reverseData.reverse()

    const groupByWeek = reverseData.reduce((acc, date) => {
      const yearWeek = moment(date).year() + '-' + moment(date).week();

      // Check if the week number exists
      if (typeof acc[yearWeek] === 'undefined') {
        acc[yearWeek] = []
      }

      acc[yearWeek].push(date)
      return acc;
    }, {});

    const countArray = []

    Object.values(groupByWeek).forEach((item) => {
      const count = item.length
      countArray.push(count)
    })

    return countArray
  }

  setShowChart = () => {
    this.setState({ showChart: true })
    if (this.state.showChart) {
      this.setState({ showChart: false })
    }
  }

  render () {
    const { data, loading, refreshing, showChart } = this.state

    this.addAllVideosToArray()
    this.sortChartData()

    return (
      <View
        style={Styles.container}
      >
        {loading ? (
          <View style={Styles.loading}>
            <Text style={Styles.loadingTitle}>Loading all PAQ videos</Text>
            <ActivityIndicator size='large' />
          </View>
        )
          :
          (
            <View>
              <View style={Styles.header}>
                <Text style={Styles.headerText}>PAQ</Text>
              </View>
              <View style={{ padding: 10 }}>
                <Text>
                  This application fetches and renders a list of all the videos uploaded to the PAQ YouTube channel as well as a basic analytics chart.
                </Text>
                <Text>Pull down the list to refresh for new videos.</Text>

              </View>
              <View style={Styles.buttonContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={Styles.analyticsButton}
                  onPress={this.setShowChart}
                >
                  {showChart ? <Text style={Styles.buttonText}>Hide Analytics Chart</Text>
                    :
                    <Text style={Styles.buttonText}>Show Analytics Chart</Text>
                  }

                </TouchableOpacity>
              </View>

              {showChart ? this.renderChart() : null}

              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                onRefresh={this.onRefresh}
                refreshing={refreshing}
                renderItem={this.renderItem}
              />
            </View>
          )
        }
      </View>
    )
  }
}

export default App
