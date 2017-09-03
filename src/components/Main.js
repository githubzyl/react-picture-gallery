require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from './ImgFigure';
import ControllerUnit from './ControllerUnit';

//let yeomanImage = require('../images/yeoman.png');

//获取图片相关的数据
let imageDatas = require('json!../data/imageDatas.json');

imageDatas = (function(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

class AppComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = this.getInitialState();
    this.Constant={
      centerPos:{
        left: 0,
        top: 0
      },
      hPosRange:{//水平方向的取值范围
        leftSecX: [0,0],
        rightSecX: [0,0],
        y: [0,0]
      },
      vPosRange:{//垂直方向的取值范围
        x: [0,0],
        topY: [0,0]
      }
    }
  }

  /**
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @ return {Function} 这是一个闭包函数，其内return一个真正被执行的函数
   */
  inverse(index){
    return function(){
      debugger;
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      })
    }.bind(this);
  }

  /**
   * 利用rearRange函数，居中对应index的图片
   * @param index
   * @returns {function(this:AppComponent)}
   */
  center(index){
    return function () {
      this.rearRange(index);
    }.bind(this);
  }

  /**
   * 获取区间内的一个随机值
   * @param low
   * @param high
   */
  getRangeRandom(low, high){
    return Math.ceil(Math.random() * (high - low) + low);
  }

  /**
   * 获取0-30之间的任意正负值
   */
  get30DegRandom(){
    return (Math.random() * 0.5 > 0 ? '' : '-') + Math.ceil(Math.random() * 30);
  }

  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
  rearRange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
        centerPos = this.Constant.centerPos,
        hPosRange = this.Constant.hPosRange,
        vPosRange = this.Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeX = vPosRange.x,
        vPosRangeTopY = vPosRange.topY,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),//取一个或不取
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //首先居中centerIndex的图片,居中的centerIndex图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    //取出要布局上侧图片的状态信息
    topImgSpliceIndex  = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局上侧的图片
    if(imgsArrangeTopArr && imgsArrangeTopArr.length > 0){
        for(var i = 0, j = imgsArrangeTopArr.length; i < j ; i++){
          imgsArrangeTopArr[i] = {
            pos: {
              top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate : this.get30DegRandom(),
            isCenter: false
          };
        }
    }

    //布局左右两侧的图片
    if(imgsArrangeArr && imgsArrangeArr.length > 0){
      for(var i = 0, j = imgsArrangeArr.length, k = j / 2 ; i <　j ; i++ ) {
        let hPosRangeLORX = null;

        if (i < k) {
          hPosRangeLORX = hPosRangeLeftSecX;
        } else {
          hPosRangeLORX = hPosRangeRightSecX;
        }

        imgsArrangeArr[i] = {
          pos: {
            top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
            left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          },
          rotate : this.get30DegRandom(),
          isCenter: false
        };

      }

    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex, 0, topImgNum);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr:imgsArrangeArr
    })

  }

  getInitialState(){
    return {
      imgsArrangeArr:[
        /*
        {
          pos:{
            left: '0',
            top: '0'
          },
          rotate: '0',//旋转角度
          isInverse: false, //正反面
          isCenter: false //是否居中
        }
        */
      ]
    }
  }

  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount(){
    //拿到舞台的大小
    let stageDom = ReactDOM.findDOMNode(this.refs.stage),
         stageW = stageDom.scrollWidth,
         stageH = stageDom.scrollHeight,
         halfStageW = Math.ceil(stageW / 2),
         halfStageH = Math.ceil(stageH / 2);

    //拿到一个imgFigure的大小
    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
         imgW = imgFigureDom.scrollWidth,
         imgH = imgFigureDom.scrollHeight,
         halfImgW = Math.ceil(imgW / 2),
         halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH -halfImgH * 3;

    this.rearRange(0);
  }

  render() {

    let controllerUnits = [],
         imgFigures = [];

    imageDatas.forEach(function(value, index){

      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}
                                 inverse={this.inverse(index)} center={this.center(index)}/>);

      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                                           inverse={this.inverse(index)} center={this.center(index)}/>);

    }.bind(this));



    return (
      /*
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
      */
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
