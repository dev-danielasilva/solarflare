import FuseUtils from '@fuse/utils/FuseUtils'
import { selectUser } from 'app/store/user/userSlice'
import { useSelector } from 'react-redux'

class DefinitionService extends FuseUtils.EventEmitter {
  private getUser() {
    const user = useSelector(selectUser)
    return user
  }

  private getTenantDefinition(_user?) {
    let user = _user ? _user : useSelector(selectUser)
    let definition = user?.tenant?.definition

    return definition
  }

  private getPublisherDefinition(_user?) {
    let user = _user ? _user : useSelector(selectUser)
    let definition = user?.tenant?.license?.publisher?.definition

    return definition
  }

  getSkinFromDefinition(key, defaultValue) {
    const user = this.getUser()
    let definition = this.getTenantDefinition()
      ? this.getTenantDefinition()
      : this.getPublisherDefinition()

    const skin = definition?.skin?.[user?.avatar?.level]

    if (skin) {
      const keySegments = key.split('.')

      let result = skin
      keySegments.forEach((segment) => {
        result = result?.[segment]
      })

      return result
    }

    return defaultValue
  }

  setBackground(user) {
    const definition = this.getTenantDefinition(user)
      ? this.getTenantDefinition(user)
      : this.getPublisherDefinition(user)

    if (definition) {
      const backgroundPattern =
        definition?.skin?.[user?.avatar?.level]?.background_pattern
      const backgroundColor =
        definition?.skin?.[user?.avatar?.level]?.background_color

      if (backgroundPattern) {
        document.body.style.backgroundImage = `url(${backgroundPattern})`
        document.body.style.backgroundAttachment = 'fixed'
      }else{
        document.body.style.backgroundImage = `unset`
      }

      if (backgroundColor) {
        document.body.style.backgroundColor = `${backgroundColor}`
      } else {
        document.body.style.backgroundColor = `#E0F1F1`
      }
    } else {
      document.body.style.backgroundColor = `#E0F1F1`
    }
  }

  getWelcomeBannerImage() {
    const definition = this.getTenantDefinition()
      ? this.getTenantDefinition()
      : this.getPublisherDefinition()
    const user = this.getUser()
    let banner

    if (definition) {
      banner = definition?.skin?.[user?.avatar?.level]?.welcome_banner_image
        ? definition?.skin?.[user?.avatar?.level]?.welcome_banner_image
        : ''
    }

    return banner
  }

  getGradesBannerImage() {
    const definition = this.getTenantDefinition()
      ? this.getTenantDefinition()
      : this.getPublisherDefinition()
    const user = this.getUser()
    let banner

    if (definition) {
      banner = definition?.skin?.[user?.avatar?.level]?.grades_banner_image
        ? definition?.skin?.[user?.avatar?.level]?.grades_banner_image
        : ''
    }

    return banner
  }

  getBackgroundColor() {
    const definition = this.getTenantDefinition() || this.getPublisherDefinition()
    const user = this.getUser()
    let color = '#43B2AE'

    if (definition) {
      color = definition?.skin?.[user?.avatar?.level]?.background_color || '#43B2AE'
    }

    return color
  }
}

const instance = new DefinitionService()

export default instance
