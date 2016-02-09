/**
 * Main app entrypoint which sets up route navigation, the side drawer menu,
 * and the orchestration of all subcomponents.
 */
'use strict'

var React = require('react-native')
var {
  Component,
  StyleSheet,
  Navigator,
  TouchableOpacity,
  Text,
  View,
} = React

var Drawer = require('react-native-drawer')
var Icon = require('react-native-vector-icons/FontAwesome')

var Gallery = require('./gallery')
var SideMenu = require('./side-menu')

class App extends Component {
  render() {
    var sideMenu = <SideMenu onSelectMenuItem={(route) => {
      if (route) {
        var routes = this.refs.nav.getCurrentRoutes()
        var current = routes[routes.length - 1]

        // only change route if it's not the same as the current route
        if (route.component !== current.component) {
          this.refs.nav.resetTo(route)
        }
      }

      this.refs.drawer.close()
    }} />

    return (
      <Drawer
        ref="drawer"
        type="displace"
        content={sideMenu}
        openDrawerOffset={0.3}
        tweenDuration={200}
        tapToClose={true}
        acceptPan={false}
      >
        <Navigator
          ref="nav"
          style={styles.container}
          initialRoute={{
            title: 'TextBlast',
            component: Gallery,
          }}
          renderScene={this._renderScene.bind(this)}
          navigationBar={<Navigator.NavigationBar
            routeMapper={navigationBarRouteMapper(this)}
            style={styles.navBar}
          />}
          configureScene={this._configureScene.bind(this)}
        />
      </Drawer>
    )
  }

  _renderScene(route, navigator) {
    var Component = route.component

    return (
      <View style={styles.scene}>
        <Component {...route.props} navigator={navigator} route={route} />
      </View>
    )
  }

  _configureScene(route) {
    if (route.configureScene) {
      return route.configureScene()
    } else {
      return Navigator.SceneConfigs.FloatFromRight
    }
  }
}

function navigationBarRouteMapper (parent) {
  return {
    LeftButton: function (route, navigator, index) {
      if (route.renderLeftButton) {
        return route.renderLeftButton()
      } else if (index === 0) {
        return (
          <TouchableOpacity
            style={styles.navBarLeftButton}
            onPress={() => {
              if (parent.refs.drawer._open) {
                parent.refs.drawer.close()
              } else {
                parent.refs.drawer.open()
              }
            }}>
            <Icon name="bars" size={24} color="#000" />
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity
            onPress={() => navigator.pop()}
            style={styles.navBarLeftButton}>
            <Icon name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>
        )
      }
    },

    RightButton: function (route) {
      if (route.renderRightButton) {
        return route.renderRightButton()
      } else {
        return null
      }
    },

    Title: function (route) {
      return (
        <Text style={[styles.navBarText, styles.navBarTitleText]}>
          {route.title}
        </Text>
      )
    },
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  navBarRightButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scene: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#EAEAEA',
  },
})

module.exports = App
