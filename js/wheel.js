var speed = 40;
var integral = 100; //初始积分
var islogin = true;

var phonenumber=null; //手机号是否存在

window.onload = function() {
	/*
	 ** 抽奖概率为 总和 * 10 ; 总概率 360°
	 ** 旋转最少  turn +  度数的圈数 ;
	 **
	 */
	var PrizeSon = ["50元现金红包", "599元免费券", "五元现金红包", "再来一次", "两元现金红包", "399元免费券", "一元现金红包", "谢谢参与"]; //奖品提示
	var totalNum = 8; // 转盘 总数
	var trunNum = [1, 2, 3, 4, 5, 6, 7, 8]; //概率奖品 编号
	var turntable = []; // 随机概率计算
	var isStatr = false; //锁 专拍没有执行完的时候 不可以再次点击 ;
	var lenCloc = 0; //当前第几次计算叠加的度数
	var turn = 3; //转盘旋转最低的圈数

	var brn = document.getElementById("button");
	var wheel = document.getElementById("wheel");

	/* 循环概率 */
	for(var i = 0; i < trunNum.length; i++) {
		for(var j = 0; j < trunNum[i]; j++) {
			turntable.push(i + 1);

		}
	}

	/* 点击 开始  */
	brn.onclick = function() {
		if(islogin == false) {
			//询问框
			layer.open({
				content: '请先去登录！',
				btn: ['残忍拒绝', '去登录'],
				yes: function(index) {
					layer.close(index);
					layer.close(index);

				}
			});
		} else {
			if(!isStatr) {
				isStatr = true;
				var random = Math.floor(Math.random() * turntable.length);
				//console.log(Math.floor(Math.random()*turntable.length)%6);
				operation(random);
			} else {
				return false;
			}
		}

	}

	/*    开始 function  ran = 随机    */
	function operation(ran) {
		var price_integral = parseInt(document.getElementById("integral").innerHTML); //剩余的积分总数
		if(price_integral >= 10) {
			integral = integral - 10;
			document.getElementById("integral").innerHTML = integral; //扣分

			lenCloc++;
//			var Prize = turntable[ran] - 1, //中奖编号
			var Prize =0, //中奖编号
				sun = turn * 360; //编号  // 度数  //  时间
			if(Prize >= totalNum) {
				Prize = 0;
			}
			var soBuom = parseInt(Math.floor(Math.random() * 45) - 22.5);

			/*    避免多次出现1等奖 所以要删除 下标    */
			turntable.splice(ran, 1);

			/*    旋转度数 = 上次度数+ 最小圈数 * 360 + 当前数字 * 45 +随机角度  = 最终旋转度数     */
			wheel.style.transform = "rotate(" + ((lenCloc * sun + Prize * 45) + soBuom) + "deg)";
			//wheel.style.webkitTransform = "rotate("+((lenCloc*sun+Prize*60)+soBuom)+"deg)";

			setTimeout(function() {

				//				alert("恭喜，您获得了奖品:" + PrizeSon[Prize]);
				//询问框
				layer.open({
					content: '恭喜，您获得了奖品：' + PrizeSon[Prize],
					btn: ['不要', '炫耀下'],
					yes: function(index) {
						layer.close(index);
						location.reload();

					}
				});
				isStatr = false;

			}, 3200);

		} else {
			//询问框
			layer.open({
				content: '您的积分不足，请前去充值或分享得积分',
				btn: ['充值', '分享', '取消'],
				yes: function(index) {
					layer.close(index);
					layer.close(index);
					layer.close(index);

				}
			});

		}

	}

	//获取用户信息，如新用户则提示注册，如老用户则可以抽奖
	$.ajax({
		url: "url",
		type: "get",
		dataType: "json",
		data: {
			
		},
		success: function(response) {

		},
		error: function() {}
	});

}