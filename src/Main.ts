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
            RES.loadGroup("cake", 0);
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
    private static NUM:number = 11; // 星星数量
    private _rectScope:egret.Rectangle; /// 星星出现的范围（确保不出屏幕
    private starIndex:number = 0;
    private bg:egret.Bitmap;
    private texts = [["白色","橙色","粉红","粉蓝"],["春天","夏天","秋天","冬天"],["大海","森林","草原","雪山"]];
    private answers = new Array<String>();
    private starTextTopArray = ["你问我有没有大男子主义？","你第一次加我的时候问我是在哪遇见了你",
    "你5月26号的时候说过，你想去锦绣中华","你说你经常迷路",
    "你知道你第一次主动找我是什么时候吗？","6月12号发生的事情还挺多的",
    "有一天，你说杭姐哭得梨花带雨，你却在笑她","6月29号是你第一次来珠海",
    "有一次，你2天没回复我了，我很担心","你说你想听那些很冒险的梦",
    "还记得我第一次约你的那天吗"];
    private starTextTop: egret.TextField = new egret.TextField();
    private starTextBelowArray = ["我想对你的胃就应该霸道一点","是2018年5月1号的深圳北D7444列车B2入口的队伍里",
    "我一直记得，幸运的是陪你去的是我，哈哈","我想以后可以一直做你的人肉导航",
    "是2018年6月12号，那天珠海刮起了龙卷风","因为那天你和你姐吵架了，我很担心",
    "因为那天是6月22号，是你毕业的日子","也是我第一次和你吃饭，第一次和你说上了话",
    "那天是8月9号，温州刮起了台风，好像受灾很严重，我怕你是不是断网了，又没东西吃，胃又受不了了","从8月10号练了几天，还烦了杭姐听了一遍又一遍",
    "是教师节的前俩天9月8号，那天你问我，是逛街还是看电影？我最后选择静静的看着你"];
    private starTextBelow: egret.TextField = new egret.TextField();
    private nices = new Array<any>();
    private isShowComplete = false;
    private sound: egret.Sound = new egret.Sound();
    private soundChannel: egret.SoundChannel;

    // private systemLeaf:particle.ParticleSystem;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        this.sound = RES.getRes("Beautiful Life_mp3");
        this.soundChannel = this.sound.play();
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.startMusic,this)

        this.bg = this.createBitmapByName("bg_jpg");
        this.addChild(this.bg);
        this.bg.x = this.stage.stageWidth / 2 - this.bg.width / 2 - 50;
        this.bg.y = this.stage.$stageHeight / 2 - this.bg.height / 2 - 200;
        this.bg.scaleX = this.bg.scaleY = 1;
        this.showCake();
    }

    private startMusic() {
        let position = this.soundChannel.position?this.soundChannel.position:0;
        if (this.soundChannel) {
            this.soundChannel.stop();
        }
        this.soundChannel = this.sound.play(position);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.startMusic,this)
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
            textfield.x = 100;
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
        tip.x = 480;
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
            this.showText();
        },this);
        timer.start();
    }

    private showText() {
        let index = this.starIndex-1;
        let tw = egret.Tween.get(this.nices[index]);
        let textfields:Array<any> = new Array<egret.TextField>();
        let textArr = [
            <Array<egret.ITextElement>>[{text: "生日快乐，杉阿姨", style: {"size": 50, "strokeColor": 0x6699cc, "stroke": 2}}]
        ];
        let waitTimeArr:Array<any> = [5000,4000,1000,1000];
        let yArr:Array<any> = [450,550,650,750];
        let count = -1;
        for (let i = 0 ; i < textArr.length; i++) {
            let textfield: egret.TextField = new egret.TextField();
            textfield.textFlow = textArr[i];
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
                let tw = egret.Tween.get(textfields[count]);
                tw.to({ "alpha": 1 }, 1500);
                if (count == 0) {
                    tw.wait(3000)
                    tw.call((change)=>{
                         this.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                             console.log(count)
                            if (count < textArr.length-1) {
                                let tw = egret.Tween.get(textfields[++count]);
                                tw.to({ "alpha": 1 }, 1500);
                            }
                        },this)
                    }, this);
                }
                tw.wait(waitTimeArr[count]);
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

}
