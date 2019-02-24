const helpers = {}
helpers.Extract = function (m_extraccion) {
    let dinero = Math.floor(parseInt(m_extraccion));
    const caja = [];
    class Billetes {
        constructor(v, c) {
            this.valor = v;
            this.cantidad = c;
        }
    }
    if (dinero <= 500) {
        // caja.push(new Billetes(100, 2));
        caja.push(new Billetes(50, 7)); //350
        caja.push(new Billetes(20, 5)); //100
        caja.push(new Billetes(10, 9)); //90
        caja.push(new Billetes(5, 2)); //10
    }
    else if (dinero >= 500 && dinero <= 850) {
        // caja.push(new Billetes(100, 2));
        caja.push(new Billetes(50, 12)); //600
        caja.push(new Billetes(20, 10)); //200
        caja.push(new Billetes(10, 5)); //50
        caja.push(new Billetes(5, 4)); //20
    }
    else if (dinero >= 500 && dinero <= 1250) {
        // caja.push(new Billetes(100, 2));
        caja.push(new Billetes(50, 15)); //750
        caja.push(new Billetes(20, 15)); //300
        caja.push(new Billetes(10, 15)); //150
        caja.push(new Billetes(5, 10)); //50
    }
    else if (dinero >= 1250 && dinero <= 1750) {
        // caja.push(new Billetes(100, 2));
        caja.push(new Billetes(50, 22)); //1100
        caja.push(new Billetes(20, 25)); //500
        caja.push(new Billetes(10, 20)); //200
        caja.push(new Billetes(5, 10)); //50
    }
    else if (dinero >= 1750 && dinero <= 3000) {
        caja.push(new Billetes(100, 12)); //1200
        caja.push(new Billetes(50, 26)); //1300
        caja.push(new Billetes(20, 30)); //300
        caja.push(new Billetes(10, 20)); //200
        caja.push(new Billetes(5, 10)); //50
    }
    const entregado = [];
    let cant_b, div = 0;

    for (let i of caja) {
        if (dinero > 0) {
            div = Math.floor(dinero / i.valor);
            if (div > i.cantidad) {
                cant_b = i.cantidad;
            }
            else {
                cant_b = div;
            }
            entregado.push(new Billetes(i.valor, cant_b));
            dinero -= (i.valor * cant_b);
        }
    }
    if (dinero > 0) {
        return false;
    }
    else {
        for (let e of entregado) {
            if (e.cantidad > 0) {
                return entregado
            }
        }
    }
}
module.exports = helpers;