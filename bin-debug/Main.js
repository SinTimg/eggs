//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._nScaleBase = 0;
        _this.stars = new Array();
        _this.starIndex = 0;
        _this.texts = [["白色", "橙色", "粉红", "粉蓝"], ["春天", "夏天", "秋天", "冬天"], ["大海", "森林", "草原", "雪山"]];
        _this.answers = new Array();
        _this.starText = new egret.TextField();
        return _this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame();
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 3:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    // private systemLeaf:particle.ParticleSystem;
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.createGameScene = function () {
        this.bg = this.createBitmapByName("bg_jpg");
        this.addChild(this.bg);
        this.bg.x = this.stage.stageWidth / 2 - this.bg.width / 2 - 50;
        this.bg.y = this.stage.$stageHeight / 2 - this.bg.height / 2 - 200;
        this.bg.scaleX = this.bg.scaleY = 1;
        this.showCake();
    };
    Main.prototype.showStartText = function () {
        var _this = this;
        var textfield = new egret.TextField();
        textfield.text = "其实我是一个能看穿事物的魔术师，我可以看穿一切，不信的话，你试试？";
        textfield.width = 400;
        textfield.alpha = 0;
        textfield.x = 50;
        textfield.y = 350;
        this.addChild(textfield);
        var tw = egret.Tween.get(textfield);
        tw.to({ "alpha": 1 }, 1500);
        tw.wait(3000);
        tw.call(function () {
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 0 }, 1000);
            tw.wait(1000);
            tw.call(_this.showChoice, _this);
        }, this);
    };
    Main.prototype.showChoice = function () {
        var _this = this;
        var textfield = new egret.TextField();
        textfield.text = "以下请选出一个你最舒适的选项";
        textfield.width = 450;
        textfield.x = 50;
        textfield.y = 250;
        this.addChild(textfield);
        var buttons = new Array();
        var _loop_1 = function (i) {
            var button = new eui.Button();
            button.width = 200;
            button.height = 80;
            button.x = 50;
            button.y = 350 + i * 100;
            buttons.push(button);
            this_1.addChild(button);
            button.$addListener(egret.TouchEvent.TOUCH_END, function () {
                _this.answers.push(button.label);
                changeProblem();
            }, this_1);
        };
        var this_1 = this;
        for (var i = 0; i < this.texts[0].length; i++) {
            _loop_1(i);
        }
        var count = 0;
        var changeProblem = function () {
            if (count < _this.texts.length) {
                for (var j = 0; j < _this.texts[count].length; j++) {
                    buttons[j].label = _this.texts[count][j];
                    var tw = egret.Tween.get(buttons[j]);
                    tw.to({ "x": 150 }, 500);
                    tw.to({ "x": 50 }, 300);
                }
            }
            else if (count == _this.texts.length) {
                for (var j = 0; j < _this.texts[count - 1].length; j++) {
                    buttons[j].label = _this.texts[count - 1][j];
                    buttons[j].removeEventListener(egret.TouchEvent.TOUCH_END, function () { }, _this);
                    var tw_1 = egret.Tween.get(buttons[j]);
                    tw_1.to({ "alpha": 0 }, 500);
                }
                var tw = egret.Tween.get(textfield);
                tw.to({ "alpha": 0 }, 500);
                tw.call(_this.showCake, _this);
            }
            count++;
        };
        changeProblem();
    };
    Main.prototype.showCake = function () {
        var _this = this;
        var cake = this.createBitmapByName("cake_png");
        this.addChild(cake);
        cake.x = 500;
        cake.y = 500;
        cake.scaleX = cake.scaleY = 0.3;
        var tw = egret.Tween.get(cake);
        tw.to({ "x": 0 }, 1000);
        tw.call(function () {
            var textfield = new egret.TextField();
            textfield.text = "今天是你的生日，特意为你准备了一个小蛋糕，来吹个蜡烛叭";
            textfield.alpha = 0;
            textfield.width = 420;
            textfield.x = 70;
            textfield.y = 200;
            _this.addChild(textfield);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 1000);
            tw.wait(1000);
            tw.call(function () {
                _this.showTip();
                /*** 本示例关键代码段开始 ***/
                var texture = RES.getRes("ballParticle_png");
                var config = RES.getRes("ballParticle_json");
                _this.system = new particle.GravityParticleSystem(texture, config);
                _this.addChild(_this.system);
                _this.system.start();
                _this.system.x = _this.stage.stageWidth / 2;
                _this.system.y = _this.stage.$stageHeight / 2 - 70;
                _this.system.emitterX = 0;
                _this.system.emitterY = 0;
                _this.system.scaleX = _this.system.scaleY = 1.5;
                /*** 本示例关键代码段结束 ***/
                _this.addEventListener(egret.TouchEvent.TOUCH_END, _this.blowTheCandle, _this);
            }, _this);
        }, this);
    };
    Main.prototype.showTip = function () {
        var tip = this.createBitmapByName("finger_png");
        tip.x = 100;
        tip.y = 400;
        tip.alpha = 0;
        tip.scaleX = tip.scaleY = 0.3;
        this.addChild(tip);
        var tw = egret.Tween.get(tip);
        tw.to({ "alpha": 0.5 }, 1000);
        tw.wait(1000);
        tw.to({ "alpha": 0 }, 1000);
    };
    Main.prototype.blowTheCandle = function () {
        var _this = this;
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.blowTheCandle, this);
        var monkey = this.createBitmapByName("monkey_png");
        this.addChild(monkey);
        monkey.x = -200;
        monkey.y = 350;
        monkey.scaleX = monkey.scaleY = 0.2;
        var tw = egret.Tween.get(monkey);
        tw.to({ "x": 0 }, 2000);
        //创建一个计时器对象
        var timer = new egret.Timer(3000, 1);
        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.stopFire, this);
        //开始计时
        timer.start();
        tw.wait(3000);
        tw.to({ "alpha": 0 }, 2000);
        timer = new egret.Timer(8000, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            var bg = _this.createBitmapByName("bg10_jpg");
            _this.addChild(bg);
            bg.x = _this.stage.stageWidth / 2 - bg.width / 2 - 50;
            bg.y = _this.stage.$stageHeight / 2 - bg.height / 2 - 200;
            bg.scaleX = bg.scaleY = 1;
            bg.alpha = 0;
            _this.changeStage(_this.bg, bg);
        }, this);
        //开始计时
        timer.start();
    };
    Main.prototype.stopFire = function () {
        // let qi = this.createBitmapByName("qi_png");
        // this.addChild(qi);
        // qi.x = 100;
        // qi.y = 400;
        // qi.scaleX = qi.scaleY = 0.1;
        var qi = this.createBitmapByName("cloud_png");
        this.addChild(qi);
        qi.x = 0;
        qi.y = 350;
        this.system.stop();
        var tw = egret.Tween.get(qi);
        tw.to({ "alpha": 0 }, 2000);
    };
    Main.prototype.changeStage = function (bg1, bg2) {
        var _this = this;
        var tw1 = egret.Tween.get(bg1);
        tw1.to({ "alpha": 0 }, 2000);
        var tw2 = egret.Tween.get(bg2);
        tw2.to({ "alpha": 1 }, 2000);
        var timer = new egret.Timer(3000, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            _this.startStar();
        }, this);
        timer.start();
    };
    Main.prototype.startStar = function () {
        var _this = this;
        this._rectScope = new egret.Rectangle(0, 0, 600, 600);
        for (var i = 0; i < Main.NUM; ++i) {
            var star = this.createBitmapByName("star_png");
            this.addChild(star);
            /// 给一个随机的初始位置
            star.x = this._rectScope.x + this._rectScope.width * Math.random();
            star.y = this._rectScope.y + this._rectScope.height * Math.random();
            star.scaleX = star.scaleY = Main.SCALE_BASE;
            this.stars.push(star);
            this.addChild(star);
        }
        // 产生动画
        this.stage.addEventListener(egret.Event.ENTER_FRAME, function (evt) {
            var scale = Main.SCALE_BASE + Math.abs(Math.sin(_this._nScaleBase += 0.03)) * Main.SCALE_RANGE;
            _this.stars[_this.starIndex].scaleX = _this.stars[_this.starIndex].scaleY = scale;
        }, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.showPicture, this);
        this.showTip();
        this.starText.text = "满天繁星都像极了你的样子";
        this.starText.width = 420;
        this.starText.alpha = 0;
        this.starText.x = 130;
        this.starText.y = 850;
        this.addChild(this.starText);
        var tw = egret.Tween.get(this.starText);
        tw.to({ "alpha": 1 }, 1500);
    };
    Main.prototype.showPicture = function () {
        var _this = this;
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.showPicture, this);
        var nice = this.createBitmapByName("nice" + this.starIndex + "_jpg");
        this.addChild(nice);
        nice.x = this.stars[this.starIndex].x;
        nice.y = this.stars[this.starIndex].y;
        nice.width = nice.height = 0;
        var tw = egret.Tween.get(nice);
        tw.to({ "x": 80, "y": 100, "width": 480, "height": 720 }, 2000);
        tw.wait(1000);
        tw.to({ "x": this.stars[this.starIndex].x, "y": this.stars[this.starIndex].y, "scaleX": 0, "scaleY": 0 }, 2000);
        this.stars[this.starIndex].scaleX = this.stars[this.starIndex].scaleY = Main.SCALE_BASE;
        if (this.starIndex < Main.NUM - 1) {
            this.starIndex++;
            var timer = new egret.Timer(5000, 1);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.showPicture, _this);
            }, this);
            timer.start();
        }
        else {
            var timer = new egret.Timer(5000, 1);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                _this.showText();
            }, this);
            timer.start();
        }
    };
    Main.prototype.showText = function () {
        var _this = this;
        var starTextTw = egret.Tween.get(this.starText);
        starTextTw.to({ "alpha": 0 }, 1500);
        starTextTw.call(function () { _this.removeChild(_this.starText); });
        var textfields = new Array();
        var textArr = ["我猜你还喜欢我", "的作品", "生日快乐，鱼丸妹"];
        textArr.unshift("\u6211\u731C,\u90A3\u4E48\u591A\u989C\u8272\u4E2D\uFF0C\u4F60\u5BF9" + this.answers[0] + "\u60C5\u6709\u72EC\u949F\u3002\u5728\u4E00\u5E74\u4E4B\u4E2D\uFF0C" + this.answers[1] + "\u662F\u4F60\u6700\u9700\u8981\u966A\u4F34\u7684\u5B63\u8282\u3002\u5982\u679C\u6709\u673A\u4F1A\uFF0C\u6211\u76F8\u4FE1\u4F60\u4E00\u5B9A\u5F88\u60F3\u53BB" + this.answers[2] + "\u770B\u770B\u3002\u6211\u662F\u4E0D\u662F\u731C\u7684\u5F88\u51C6?\u8FD8\u6709......");
        var waitTimeArr = [1000, 7000, 3000, 1000];
        var yArr = [0, 250, 350, 450];
        var count = -1;
        for (var i = 0; i < textArr.length; i++) {
            var textfield = new egret.TextField();
            textfield.text = textArr[i];
            textfield.width = 420;
            textfield.alpha = 0;
            textfield.x = 50;
            textfield.y = 50 + yArr[i];
            textfields.push(textfield);
            this.addChild(textfield);
        }
        var change = function () {
            count++;
            if (count < textArr.length) {
                // 切换描述内容
                var tw = egret.Tween.get(textfields[count]);
                tw.wait(waitTimeArr[count]);
                tw.to({ "alpha": 1 }, 1500);
                tw.call(change, _this);
            }
        };
        change();
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = result.map(function (text) { return parser.parse(text); });
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var textFlow = textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    /**
     * 点击按钮
     * Click the button
     */
    Main.prototype.onButtonClick = function (e) {
        var panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    };
    Main.SCALE_BASE = .5;
    Main.SCALE_RANGE = .5;
    Main.NUM = 12; // 星星数量
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map