import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Input,
  Switch,
  neobrutalismStyles
} from 'neobrutalism-vue/dist/index.mjs'

export default {
  install(app) {
    // Register all neobrutalism components globally
    app.component('NeoAlert', Alert)
    app.component('NeoAvatar', Avatar)
    app.component('NeoBadge', Badge)
    app.component('NeoButton', Button)
    app.component('NeoCard', Card)
    app.component('NeoCheckbox', Checkbox)
    app.component('NeoContainer', Container)
    app.component('NeoInput', Input)
    app.component('NeoSwitch', Switch)
  }
}
