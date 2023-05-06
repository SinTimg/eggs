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
            RES.loadGroup("star", 0);
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
    private static NUM:number = 9; // 星星数量
    private _rectScope:egret.Rectangle; /// 星星出现的范围（确保不出屏幕
    private starIndex:number = 0;
    private bg:egret.Bitmap;
    private texts = [["接受","只想接受","我心都酥了"]];
    private answers = new Array<String>();
    private starTextTopArray = [
        "这是咱们第一次聊天的样子，你还记得吗？",
        "这是咱们第一次见面的样子，你还记得吗？",
        "这是咱们第一次在一起的样子，你还记得吗？",
        "这是你第一次来珠海的样子，你还记得吗？",
        "还记得这只狗吗？",
        "这是我们去了心心念念长隆的时候，你还记得吗？",
        "还记得这只长颈鹿吗？",
        "这是我们第一次去真正去旅游的时候，你还记得吗？",
        "这是我失业的日子，真是一段黑暗的时光"];
    private starTextTop: egret.TextField = new egret.TextField();
    private starTextBelowArray = [
        "你当时还不怎么爱理我",
        "第一次见你还穿着小裙子真可爱",
        "也是我第一次牵起女孩的手，真软真温柔",
        "那也是我第一次和女孩子抱在一起，把我紧张得一晚上都睡不着。",
        "那只狗气得你哇哇叫，你还死不承认。",
        "那时候还是疫情，这也是我第一次和你出去玩，那一天虽然很热，但是真的玩很开心。",
        "那是我们第一次去动物园，从那之后还约定了一定要去广州长隆动物园看看。",
        "那个时候也还是疫情，我们前脚刚走，那里后脚就封了，那也是我们第一次真正的出去旅游，也是我第一次看见雪，真的很开心。",
        "无所事事的我，跟这只鸭子一样闲，你一直默默的陪伴着我，还不断的鼓励我。"];
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
        this.showStartText();
    }

    private startMusic() {
        let position = this.soundChannel.position?this.soundChannel.position:0;
        if (this.soundChannel) {
            this.soundChannel.stop();
        }
        this.soundChannel = this.sound.play(position);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.startMusic,this)
    }

    private showStartText() {
        let textfields:Array<any> = new Array<egret.TextField>();
        let textArr = [
            <Array<egret.ITextElement>>[{text: "今天是什么日子，你还记得吗？", style: {}}],
            <Array<egret.ITextElement>>[{text: "不记得了吧，那你准备好了吗？", style: {}}],
            <Array<egret.ITextElement>>[{text: "接下来，跟着我一起，挖呀挖呀挖。", style: {"size": 50, "strokeColor": 0x6699cc, "stroke": 2}}]
        ];
        let waitTimeArr:Array<any> = [3000,3000,3000];
        let yArr:Array<any> = [0,250,350];
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
            } else{
                let bg = this.createBitmapByName("bg10_jpg");
                this.addChild(bg);
                bg.x = this.stage.stageWidth / 2 - bg.width / 2 - 50;
                bg.y = this.stage.$stageHeight / 2 - bg.height / 2 - 200;
                bg.scaleX = bg.scaleY = 1;
                bg.alpha = 0;
                this.changeStage(this.bg, bg);
            }
        };
        change();
    }

    private showChoice() {
        let textfield: egret.TextField = new egret.TextField();
        textfield.text = "以下请选出一个你最舒适的选项";
        textfield.width = 450;
        textfield.x = 80;
        textfield.y = 250;
        // this.addChild(textfield);
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
                    tw.to({ "x":  200}, 500);
                    tw.to({ "x": 100 }, 300);
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
                tw.call(this.showResult,this);
            }
            count++
        }
        changeProblem()
        
    }

     private showResult() {
        /*** 本示例关键代码段开始 ***/
        let jieshou = this.createBitmapByName("jieshou_jpg");
        jieshou.x = this.stage.stageWidth / 2 - jieshou.width / 2;
        jieshou.y = this.stage.$stageHeight / 2 - jieshou.height / 2;
        this.addChild(jieshou);
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
            this.startStar();
        },this);
        timer.start();
    }

    private startStar() {
        this._rectScope = new egret.Rectangle( 0, 300, 600, 300);

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
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.hidePicture,this);
        this.showTip();
    }

    private hidePicture() {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.hidePicture,this);
        if (this.starIndex > 0) {
            let index = this.isShowComplete? this.starIndex : this.starIndex-1;
            let tw = egret.Tween.get(this.nices[index]);
            tw.to({ "x": this.stars[index].x, "y": this.stars[index].y, "scaleX": 0,"scaleY": 0 }, 2000);
            let starTextTopTw = egret.Tween.get(this.starTextTop);
            starTextTopTw.to({ "alpha": 0 }, 2000);
            let starTextBelowTw = egret.Tween.get(this.starTextBelow);
            starTextBelowTw.to({ "alpha": 0 }, 2000);
            if (this.isShowComplete) {
               starTextBelowTw.call(this.showText, this);
            } else {
               starTextBelowTw.call(this.showPicture, this);
            }
        } else {
            this.addChild(this.starTextTop)
            this.addChild(this.starTextBelow)
            this.showPicture();
        }
    }

    private showPicture() {
        this.starTextTop.text = this.starTextTopArray[this.starIndex];
        this.starTextTop.width = 430;
        this.starTextTop.alpha = 0;
        this.starTextTop.x = 90;
        this.starTextTop.y = 50;
        let starTextTopTw = egret.Tween.get(this.starTextTop);
        starTextTopTw.to({ "alpha": 1 }, 1000);
        let change = ()=>{
            let nice:egret.Bitmap = this.createBitmapByName("star"+this.starIndex+"_jpg");
            this.addChild(nice);
            nice.x = this.stars[this.starIndex].x;
            nice.y = this.stars[this.starIndex].y;
            nice.width = nice.height = 0;
            this.nices.push(nice);
            let tw = egret.Tween.get(nice);
            tw.to({"x": 50,"y": 120, "width": 520,"height": 850 }, 2000);

            this.starTextBelow.text = this.starTextBelowArray[this.starIndex];
            this.starTextBelow.width = 430;
            this.starTextBelow.alpha = 0;
            this.starTextBelow.x = 90;
            this.starTextBelow.y = 1000;
            
            let starTextBelowTw = egret.Tween.get(this.starTextBelow);
            starTextBelowTw.to({ "alpha": 1 }, 2000);
            this.stars[this.starIndex].scaleX = this.stars[this.starIndex].scaleY = Main.SCALE_BASE;
            if (this.starIndex < Main.NUM - 1) {
                this.starIndex++;
            } else {
                this.isShowComplete = true;
            }
            
            let timer:egret.Timer = new egret.Timer(2000,1);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,() => {
                this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.hidePicture,this)
            }, this);
            timer.start();
        }
        starTextTopTw.call(change,this)
    }

    private showText() {
        let index = this.starIndex-1;
        let tw = egret.Tween.get(this.nices[index]);
        tw.to({ "x": this.stars[index].x, "y": this.stars[index].y, "scaleX": 0,"scaleY": 0 }, 2000);
        this.removeChild(this.starTextTop)
        this.removeChild(this.starTextBelow)
        let textfields:Array<any> = new Array<egret.TextField>();
        let textArr = [
            <Array<egret.ITextElement>>[{text: "今天其实不是什么特别的日子，", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "但是，你可以让它变为特别的日子，", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "那天你说我不能因为他们的决定，而是取决我的行动，真的有点伤到我的心了，", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "我一直在行动吖宝贝，只是你一直不买账捏。", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "还记得我第一次给你做的惊喜结尾嘛，", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "那个时候，我不敢直言你喜欢我，只敢取巧说你喜欢我的作品。", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "现在，我想大大方方的和你说，", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "你不止喜欢我，你还爱我，我也爱你(ღ˘⌣˘ღ)。", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "你说，我说的对吗，宝贝？", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "喜欢我的作品吗，喜欢的话....", style: {"strokeColor": 0x6699cc,}}],
            <Array<egret.ITextElement>>[{text: "那就嫁给我吧，这样我才能继续给你持续不断的惊喜哦。😛😛😛", style: {"strokeColor": 0x6699cc,}}]
        ];
        let waitTimeArr:Array<any> = [5000,4000,1000,1000];
        let y = 50;
        let count = -1;
        for (let i = 0 ; i < textArr.length; i++) {
            let textfield: egret.TextField = new egret.TextField();
            textfield.textFlow = textArr[i];
            textfield.width = 520;
            textfield.alpha = 0;
            textfield.x = 50;
            textfield.y = y + 80 * i;
            textfields.push(textfield);
            this.addChild(textfield);
        }
        let change = () => {
            count++;
            if (count < textArr.length) {
                let tw = egret.Tween.get(textfields[count]);
                tw.to({ "alpha": 1 }, 1500);
                if (count == 0) {
                    tw.call((change)=>{
                         this.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                            if (count < textArr.length-1) {
                                let tw = egret.Tween.get(textfields[++count]);
                                tw.to({ "alpha": 1 }, 1500);
                            }
                        },this)
                    }, this);
                }
                tw.wait(3000);
                tw.call(change, this);
            } else {
                this.showChoice();
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
