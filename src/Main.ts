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

class Main extends eui.UILayer {

    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame()
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    private system:particle.ParticleSystem;
    private static SCALE_BASE:number = .5;
    private static SCALE_RANGE:number = .5;
    private _nScaleBase:number = 0; 
    private stars:Array<egret.Bitmap> = new Array<egret.Bitmap>();
    private static NUM:number = 12; // 星星数量
    private _rectScope:egret.Rectangle; /// 星星出现的范围（确保不出屏幕
    private starIndex:number = 0;
    private bg:egret.Bitmap;
    private texts = [["白色","橙色","粉红","粉蓝"],["春天","夏天","秋天","冬天"],["大海","森林","草原","雪山"]];
    private answers = new Array<String>();
    private starText: egret.TextField = new egret.TextField();

    // private systemLeaf:particle.ParticleSystem;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        
        this.bg = this.createBitmapByName("bg_jpg");
        this.addChild(this.bg);
        this.bg.x = this.stage.stageWidth / 2 - this.bg.width / 2 - 50;
        this.bg.y = this.stage.$stageHeight / 2 - this.bg.height / 2 - 200;
        this.bg.scaleX = this.bg.scaleY = 1;
        this.showCake();
    }

    private showStartText() {
        let textfield: egret.TextField = new egret.TextField();
        textfield.text = "其实我是一个能看穿事物的魔术师，我可以看穿一切，不信的话，你试试？";
        textfield.width = 400;
        textfield.alpha = 0;
        textfield.x = 50;
        textfield.y = 350;
        this.addChild(textfield);
        let tw = egret.Tween.get(textfield);
        tw.to({ "alpha": 1 }, 1500);
        tw.wait(3000);
        tw.call(()=>{
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 0 }, 1000);
            tw.wait(1000);
            tw.call(this.showChoice,this)
        },this)
    }

    private showChoice() {
        let textfield: egret.TextField = new egret.TextField();
        textfield.text = "以下请选出一个你最舒适的选项";
        textfield.width = 450;
        textfield.x = 50;
        textfield.y = 250;
        this.addChild(textfield);
        let buttons = new Array<eui.Button>();
        for(let i = 0; i < this.texts[0].length; i++) {
            let button = new eui.Button();
            button.width = 200;
            button.height = 80;
            button.x = 50;
            button.y = 350 + i *100;
            buttons.push(button);
            this.addChild(button);
            button.$addListener(egret.TouchEvent.TOUCH_END,()=> {
                this.answers.push(button.label)
                changeProblem()
            },this)
        }
        let count = 0;
        let changeProblem = () => {
            if (count < this.texts.length) {
                for (let j = 0; j < this.texts[count].length; j++) {
                    buttons[j].label = this.texts[count][j];
                    let tw = egret.Tween.get(buttons[j]);
                    tw.to({ "x":  150}, 500);
                    tw.to({ "x": 50 }, 300);
                }
            } else if(count == this.texts.length) {
                for (let j = 0; j < this.texts[count-1].length; j++) {
                    buttons[j].label = this.texts[count-1][j];
                    buttons[j].removeEventListener(egret.TouchEvent.TOUCH_END,()=>{},this)
                    let tw = egret.Tween.get(buttons[j]);
                    tw.to({ "alpha":  0}, 500);
                }
                let tw = egret.Tween.get(textfield);
                tw.to({ "alpha":  0}, 500);
                tw.call(this.showCake,this);
            }
            count++
        }
        changeProblem()
        
    }

    private showCake() {
        let cake = this.createBitmapByName("cake_png");
        this.addChild(cake);
        cake.x = 500;
        cake.y = 500;
        cake.scaleX =cake.scaleY = 0.3;

        let tw = egret.Tween.get(cake);
        tw.to({ "x":  0}, 1000);
        tw.call(()=>{
            let textfield = new egret.TextField();
            textfield.text = "今天是你的生日，特意为你准备了一个小蛋糕，来吹个蜡烛叭";
            textfield.alpha = 0;
            textfield.width = 420;
            textfield.x = 70;
            textfield.y = 200;
            this.addChild(textfield);
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha":  1}, 1000);
            tw.wait(1000);
            tw.call(()=>{
                this.showTip();
                /*** 本示例关键代码段开始 ***/
                let texture = RES.getRes("ballParticle_png");
                let config = RES.getRes("ballParticle_json");
                this.system = new particle.GravityParticleSystem(texture, config);
                this.addChild(this.system);
                this.system.start();
                this.system.x = this.stage.stageWidth / 2;
                this.system.y = this.stage.$stageHeight / 2 - 70;
                this.system.emitterX = 0;
                this.system.emitterY = 0;
                this.system.scaleX = this.system.scaleY = 1.5;
                /*** 本示例关键代码段结束 ***/
                this.addEventListener(egret.TouchEvent.TOUCH_END,this.blowTheCandle,this);
            },this)
        },this)
        
        
    }

    private showTip() {
        let tip = this.createBitmapByName("finger_png");
        tip.x = 100;
        tip.y = 400;
        tip.alpha = 0;
        tip.scaleX = tip.scaleY = 0.3;
        this.addChild(tip);
        let tw = egret.Tween.get(tip);
        tw.to({ "alpha":  0.5}, 1000);
        tw.wait(1000);
        tw.to({ "alpha":  0}, 1000);
    }

    private blowTheCandle() {
        this.removeEventListener(egret.TouchEvent.TOUCH_END,this.blowTheCandle,this);
        let monkey = this.createBitmapByName("monkey_png");
        this.addChild(monkey);
        monkey.x = -200;
        monkey.y = 350;
        monkey.scaleX = monkey.scaleY = 0.2;
        let tw = egret.Tween.get(monkey);
        tw.to({ "x": 0 }, 2000);
        //创建一个计时器对象
        let timer:egret.Timer = new egret.Timer(3000,1);
        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.stopFire,this);
        //开始计时
        timer.start();
        tw.wait(3000);
        tw.to({ "alpha": 0 }, 2000);
        timer = new egret.Timer(8000,1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            let bg = this.createBitmapByName("bg10_jpg");
            this.addChild(bg);
            bg.x = this.stage.stageWidth / 2 - bg.width / 2 - 50;
            bg.y = this.stage.$stageHeight / 2 - bg.height / 2 - 200;
            bg.scaleX = bg.scaleY = 1;
            bg.alpha = 0;
            this.changeStage(this.bg, bg)
        },this);
        //开始计时
        timer.start();
    }
    private stopFire() {
        // let qi = this.createBitmapByName("qi_png");
        // this.addChild(qi);
        // qi.x = 100;
        // qi.y = 400;
        // qi.scaleX = qi.scaleY = 0.1;
        let qi = this.createBitmapByName("cloud_png");
        this.addChild(qi);
        qi.x = 0;
        qi.y = 350;
        this.system.stop();
        let tw = egret.Tween.get(qi);
        tw.to({ "alpha": 0 }, 2000);
    }

    private changeStage(bg1:egret.Bitmap,bg2:egret.Bitmap) {
        let tw1 = egret.Tween.get(bg1);
        tw1.to({ "alpha": 0 }, 2000);
        let tw2 = egret.Tween.get(bg2);
        tw2.to({ "alpha": 1 }, 2000);
        let timer:egret.Timer = new egret.Timer(3000,1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,() => {
            this.startStar();
        },this);
        timer.start();
    }

    private startStar() {
        this._rectScope = new egret.Rectangle( 0, 0, 600, 600);

        for ( let i = 0; i < Main.NUM; ++i ) {
            let star:egret.Bitmap = this.createBitmapByName("star_png");
            this.addChild(star);

            /// 给一个随机的初始位置
            star.x = this._rectScope.x + this._rectScope.width * Math.random();
            star.y = this._rectScope.y + this._rectScope.height * Math.random();

            star.scaleX = star.scaleY = Main.SCALE_BASE;

            this.stars.push( star );
            this.addChild( star );
        }
        
        // 产生动画
        this.stage.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{
            let scale:number = Main.SCALE_BASE + Math.abs( Math.sin( this._nScaleBase += 0.03 )) * Main.SCALE_RANGE;
            this.stars[this.starIndex].scaleX = this.stars[this.starIndex].scaleY = scale;
        }, this );
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.showPicture,this);
        this.showTip();
        this.starText.text = "满天繁星都像极了你的样子";
        this.starText.width = 420;
        this.starText.alpha = 0;
        this.starText.x = 130;
        this.starText.y = 850;
        this.addChild(this.starText)
        let tw = egret.Tween.get(this.starText);
        tw.to({ "alpha": 1 }, 1500);
    }

    private showPicture() {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.showPicture,this);
        let nice:egret.Bitmap = this.createBitmapByName("nice"+this.starIndex+"_jpg");
        this.addChild(nice);
        nice.x = this.stars[this.starIndex].x;
        nice.y = this.stars[this.starIndex].y;
        nice.width = nice.height = 0;
        let tw = egret.Tween.get(nice);
        tw.to({"x": 80,"y": 100, "width": 480,"height": 720 }, 2000);
        tw.wait(1000);
        tw.to({ "x": this.stars[this.starIndex].x, "y": this.stars[this.starIndex].y, "scaleX": 0,"scaleY": 0 }, 2000);
        this.stars[this.starIndex].scaleX = this.stars[this.starIndex].scaleY = Main.SCALE_BASE;
        if (this.starIndex < Main.NUM-1) {
            this.starIndex++;
            let timer:egret.Timer = new egret.Timer(5000,1);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,() => {
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.showPicture,this)
            }, this);
            timer.start();
        } else {
            let timer:egret.Timer = new egret.Timer(5000,1);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,() => {
                this.showText()
            }, this);
            timer.start();
        }
    }

    private showText() {
        let starTextTw = egret.Tween.get(this.starText);
        starTextTw.to({ "alpha": 0 }, 1500);
        starTextTw.call(()=>{this.removeChild(this.starText);})
        let textfields:Array<any> = new Array<egret.TextField>()
        let textArr:Array<any> = ["我猜你还喜欢我","的作品","生日快乐，鱼丸妹"];
        textArr.unshift(`我猜,那么多颜色中，你对${this.answers[0]}情有独钟。在一年之中，${this.answers[1]}是你最需要陪伴的季节。如果有机会，我相信你一定很想去${this.answers[2]}看看。我是不是猜的很准?还有......`);
        let waitTimeArr:Array<any> = [1000,7000,3000,1000];
        let yArr:Array<any> = [0,250,350,450];
        let count = -1;
        for (let i = 0 ; i < textArr.length; i++) {
            let textfield: egret.TextField = new egret.TextField();
            textfield.text = textArr[i];
            textfield.width = 420;
            textfield.alpha = 0;
            textfield.x = 50;
            textfield.y = 50 + yArr[i];
            textfields.push(textfield);
            this.addChild(textfield);
        }
        let change = () => {
            count++;
            if (count < textArr.length) {
                // 切换描述内容
                let tw = egret.Tween.get(textfields[count]);
                tw.wait(waitTimeArr[count]);
                tw.to({ "alpha": 1 }, 1500);
                tw.call(change, this);
            }
        };
        change();
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }
}