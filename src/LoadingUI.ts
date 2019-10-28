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

class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {

    public constructor() {
        super();
        this.createView();
    }

    private textField: egret.TextField;
    private shp:egret.Shape = new egret.Shape();
    private color = [0xFF795DB3,0xFFF2991D,0xFF17CC10,0xff0000];
    private count = 0;
    private textTip: egret.TextField = new egret.TextField();
    private textContext: egret.TextField = new egret.TextField();

    private createView(): void {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.x = 80;
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.addChild(this.textTip);
        this.textTip.x = 50;
        this.textTip.y = 350;
        this.textTip.width = 550;
        this.textTip.height = 200;
        this.textTip.textAlign = "center";
        this.textTip.textFlow = <Array<egret.ITextElement>>[
            {text: "当你在等待第五个资源加载的时候，请不要着急关掉，然后调高你的手机媒体音量。接着阅读以下文字。", style: {"size": 30, "strokeColor": 0x6699cc, "stroke": 2}},
        ]
        this.addChild(this.textContext);
        this.textContext.x = 50;
        this.textContext.y = 500;
        this.textContext.width = 550;
        this.textContext.height = 300;
        this.textContext.textAlign = "center";
        this.textContext.textFlow = <Array<egret.ITextElement>>[
            {text: "我妹翻我书包，挺认真看我笔记，我一脸老成的说：是不是看不懂?等你过几年就能接触了，妹妹似懂非懂点了点头。\n", style: {"textColor": 0x00ffff}},
            {text: "然后乖巧问我：哥，你这笔记能不能借我半天?\n", style: {"textColor": 0x00ffff}},
            {text: "我正疑问时，妹妹又说：我老师说我找不到比我写字还丑的人，明天给我老师瞧瞧看她服不服\n", style: {"textColor": 0x00ffff}},
            {text: "我猜你读完这段文字的时候，应该也差不多加载完了叭!\n", style: {"textColor": 0x00ffff}}
        ]
        this.shp.graphics.beginFill( 0xff0000, 1);
        this.shp.graphics.drawRect( 0, 0, 50, 50 );
        this.shp.graphics.endFill();
        this.shp.anchorOffsetX = 25;
        this.shp.anchorOffsetY = 25;
        this.shp.x = 50;
        this.shp.y = 230;
        this.addChild( this.shp );
        this.addEventListener( egret.Event.ENTER_FRAME,(evt:egret.Event)=>{
            this.shp.rotation += 3;
            if(this.shp.x<600) {
                this.shp.x += 2;
            } else {
                this.shp.x = 50;
                if(this.count > 3) {
                    this.count = 0;
                }
                this.shp.graphics.clear()
                this.shp.graphics.beginFill(this.color[this.count++],1);
                this.shp.graphics.drawRect( 0, 0, 50, 50 );
                this.shp.graphics.endFill();
            }
            
        },this)
    }

    public onProgress(current: number, total: number): void {
        this.textField.text = `Loading...${current}/${total}`;
    }
}
