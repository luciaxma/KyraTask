import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  header: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  headerText: {
    paddingTop: 20,
    color: '#800000',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  loading: {
    marginTop: 200,
    alignItems: 'center',
    flex: 1
  },
  loadingTitle: {
    fontSize: 20,
    marginBottom: 20
  },
  videoItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row'
  },
  videoThumbnail: {
    width: 160,
    height: 90
  },
  videoTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: 10
  },
  buttonContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  analyticsButton: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  barChart: {
    height: 250,
    flexDirection: 'row',
    marginBottom: 30
  }
})
