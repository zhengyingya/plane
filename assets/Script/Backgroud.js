// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bgs: [cc.Node],
        plane: cc.Node,
        enemyOne: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      var self = this
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event){
        switch(event.keyCode) {
          case cc.KEY.j:
              self.isShoot = true;
              break;
          case cc.KEY.a:
              self.isLeft = true;
              break;
          case cc.KEY.d:
              self.isRight = true;
              break;
          case cc.KEY.s:
              self.isBottom = true;
              break;
          case cc.KEY.w:
              self.isTop = true;
              break;
        }
      })

      // 松开按键时，停止向该方向的加速
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event){
        switch(event.keyCode) {
            case cc.KEY.j:
                self.isShoot = false;
                break;
            case cc.KEY.a:
                self.isLeft = false;
                break;
            case cc.KEY.d:
                self.isRight = false;
                break;
            case cc.KEY.s:
                self.isBottom = false;
                break;
            case cc.KEY.w:
                self.isTop = false;
                break;
        }      
      })

      this.schedule(this.updateEnemyOne, 3)
      this.enemyOnePool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; i++) {
            let enemy = cc.instantiate(this.enemyOne); // 创建节点
            this.enemyOnePool.put(enemy); // 通过 putInPool 接口放入对象池
      }

      this.node.on('enemy-one-killed', this.onEnemyOneKilled, this)
    },

    updateEnemyOne () {
      let enemy = null;
      if (this.enemyOnePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
          enemy = this.enemyOnePool.get();
      } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
          enemy = cc.instantiate(this.enemyOne);
      }
      var x = Math.floor(750 * Math.random());
      enemy.setPosition(x, 1394);
      this.node.addChild(enemy);
    },

    onEnemyOneKilled: function (event) {
      console.log('-------------', event)
      this.enemyOnePool.put(event.enemy)
    },

    start () {
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.memberFunction, this)
    },

    memberFunction () {
      console.log('----------------')
    },

    update (dt) {
        this.bgs[0].y -= 2
        this.bgs[1].y -= 2
        if (this.bgs[0].y <= -1400) {
            this.bgs[0].y = 1400
        }
        if (this.bgs[1].y <= -1400) {
            this.bgs[1].y = 1400
        }

        if (this.isLeft) {
          this.plane.x -= 5;
          this.plane.x = this.plane.x <= 0 ? 0 : this.plane.x;
        }
        if (this.isRight) {
          this.plane.x += 5;
          this.plane.x = this.plane.x >= 750 ? 750 : this.plane.x;
        }
        if (this.isTop) {
          this.plane.y += 5;
          this.plane.y = this.plane.y >= 1334 ? 1334 : this.plane.y;
        }
        if (this.isBottom) {
          this.plane.y -= 5;
          this.plane.y = this.plane.y <= 0 ? 0 : this.plane.y;
        }
    },
});
