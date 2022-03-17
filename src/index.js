import './main.css'
import './mains.scss'
import bg from '../public/ysby.jpeg'
// 引入字体图标文件
import './media/iconfont.css'

const a = "hello item"
console.log(a)
const img = new Image()
img.src = bg
document.getElementById('imgBox').appendChild(img)

class Author {
  name = 'ITEM'
  age = 18
  email = 'lxp_work@163.com'

  info = () => {
    return {
      name: this.name,
      age: this.age,
      email: this.email
    }
  }
}

module.exports = Author