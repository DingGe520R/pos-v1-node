const loadAllItems = require('../main/datbase')
const loadPromotions = require('../main/discount')
module.exports = function main(inputs) {
    var Items = loadAllItems();
    var promotions = loadPromotions();
    var h = {};
    for (let i in inputs) {         //h里存放种类、个数
        if (inputs[i].length == 10) {
            let a = inputs[i];
            h[a] === undefined ? h[a] = 1 : (h[a]++);
        }
        else {
            let zz = inputs[i].split('-');
            let a = zz[0];
            h[a] === undefined ? h[a] = Number(zz[1]) : h[a]++;
        }
    }
    var classfiy=beforedis();   //原价商品所有信息
    var dis = discount();       //打折后商品的所有信息
    var sum = 0;                //原商品总价 
    for (let i of classfiy) {
        sum += i.price * i.count;
    }
    var dissum = Number(dis[0].dsum) + Number(dis[1].dsum) + Number(classfiy[1].price * classfiy[1].count);   //打折后商品总价


    function beforedis() {
        var classfiy = [];        //classfiy里存放 name 、count
        for (let i in h) {
            for (let j of Items) {
                if (i == j.barcode) {
                    classfiy.push(
                        {
                            barcode: j.barcode,
                            name: j.name,
                            count: h[i],
                            unit: j.unit,
                            price: j.price
                        }
                    )
                }
            }

        }
        return classfiy;
    }
    function discount() {
        var dis = [];
        var yuan = [];
        var promotion = promotions[0].barcodes;
        for (let i of classfiy) {
            for (let j of promotion) {
                if (i.barcode === j && i.count >= 2) {   //判断是否有打折商品
                    dis.push({
                        name: i.name,
                        unit: i.unit,
                        dsum: ((i.count - 1) * i.price).toFixed(2),
                        count: i.count,
                        sum: i.price * i.count,
                        price: i.price

                    })
                }

            }
        }
        return dis;
    }
    var r = '***<没钱赚商店>购物清单***\n' +
        '名称：' + dis[0].name + '，数量：' + dis[0].count + dis[0].unit + '，单价：' + (dis[0].price).toFixed(2) + '(元)，小计：' + dis[0].dsum + '(元)\n' +
        '名称：' + classfiy[1].name + '，数量：' + classfiy[1].count + classfiy[1].unit + '，单价：' + (classfiy[1].price).toFixed(2) + '(元)，小计：' + (classfiy[1].price * classfiy[1].count).toFixed(2) + '(元)\n' +
        '名称：' + dis[1].name + '，数量：' + dis[1].count + dis[1].unit + '，单价：' + (dis[1].price).toFixed(2) + '(元)，小计：' + dis[1].dsum + '(元)\n' +
        '----------------------\n' +
        '挥泪赠送商品：\n' +
        '名称：' + dis[0].name + '，数量：1' + dis[0].unit + '\n' +
        '名称：' + dis[1].name + '，数量：1' + dis[1].unit + '\n' +
        '----------------------\n' +
        '总计：' + dissum.toFixed(2) + '(元)\n' +
        '节省：' + (sum - dissum).toFixed(2) + '(元)\n' +
        '**********************'
    console.log(r);
   
};