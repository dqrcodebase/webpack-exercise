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

// 新增装饰器的使用
@log('hi')
class MyClass {

}

function log (text) {
  return function (target) {
    console.log(text)
    target.prototype.logger = () => `${text}，${target.name}`
  }
}

const test = new MyClass()
test.logger()

