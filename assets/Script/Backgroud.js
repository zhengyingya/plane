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
        enemyOne: cc.Prefab,
        bullet: cc.Prefab,
        isShoot: false,
        enemyOneDur: 3,
        enemyTwoDur: 10,
        enemyOneCount: 0,
        enemyTwoCount: 0
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
          case cc.KEY.j:
              self.isShoot = true
              break
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
            case cc.KEY.j:
                self.isShoot = false
                break
        }      
      })

      this.schedule(() => {
        if (this.enemyOneDur > 0.2) {
          this.enemyOneDur -= 0.2
        }
        if (this.enemyTwoDur > 1) {
          this.enemyTwoDur -= 1
        }
      }, 20)
      this.schedule(this.updateEnemyOne, 0.2)
      this.schedule(this.addBullet, 0.1);
      this.enemyOnePool = new cc.NodePool();
        let count = 20;
        for (let i = 0; i < count; i++) {
            let enemy = cc.instantiate(this.enemyOne); // 创建节点
            this.enemyOnePool.put(enemy); // 通过 putInPool 接口放入对象池
      }
      this.bulletPool = new cc.NodePool();
        let initCount = 100;
        for (let i = 0; i < initCount; i++) {
            let bullet = cc.instantiate(this.bullet); // 创建节点
            this.bulletPool.put(bullet); // 通过 putInPool 接口放入对象池
      }

      this.node.on('enemy-one-killed', this.onEnemyOneKilled, this)
      this.node.on('bullet-killed', this.onBulletKilled, this)
    },

    addBullet () {
      if (this.isShoot) {
        let bullet = null
        if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
          bullet = this.bulletPool.get();
        } else {                            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
          bullet = cc.instantiate(this.bullet);
        }
        bullet.setPosition(this.plane.x, this.plane.y + 80)
        this.node.addChild(bullet)
      }
    },

    updateEnemyOne () {
      this.enemyOneCount ++
      if (this.enemyOneCount * 0.2 >= this.enemyOneDur) {
        console.log('-------------', this.enemyOneCount)
        this.enemyOneCount = 0
        let enemy = null;
        if (this.enemyOnePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this.enemyOnePool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this.enemyOne);
        }
        var x = Math.floor(750 * Math.random());
        enemy.setPosition(x, 1394);
        this.node.addChild(enemy);
      }
    },

    onEnemyOneKilled (event) {
      this.enemyOnePool.put(event.detail)
    },
    onBulletKilled (event) {
      this.bulletPool.put(event.detail)
    },

    start () {
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.memberFunction, this)
    },

    memberFunction () {

    },

    update (dt) {
      // console.log('pool size', this.bulletPool.size())
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
