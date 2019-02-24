$(document).ready(function () {

    $('.btn-td').click(function (e) {
        const result = window.confirm('Estás seguro que deseas eliminar la transacción?\nNo puedes revertir esta acción');
        if (result == false) {
            e.preventDefault();
        };
    });
    $('.amount').click(function(e){
        let container = $('#amount-container')
        let form = $('#form-group')
        container.empty();
        container.append(this)
        form.append(`<input type="hidden" name="amount" value="${this.value}">`)
        console.log(this.value, container)
        
    })
    $('.dues').click(function(e){
        let container = $('#dues-container')
        let form = $('#form-group')
        container.empty();
        container.append(this)
        form.append(`<input type="hidden" name="dues" value="${this.value}">`)
        console.log(this.value, container)
    })
    $('#btn-cd').click(function (e) {
        const amountContainer = $('#amount-container')
        const duesContainer = $('#dues-container')
        if(amountContainer.children().length > 1){
            alert('Debes seleccionar el monto del prestamo')
            e.preventDefault()
            return
        }if(duesContainer.children().length > 1){
            alert('Debes seleccionar la cantidad de cuotas')
            e.preventDefault()
            return
        }
        let amount = $('.amount').val()
        let dues = $('.dues').val()
        const div = amount / dues
        const result = window.confirm('Estás a punto de solicitar el siguiente credito' +
            '\nMonto de la deuda: ' + amount +
            '\nCantidad de cuotas: ' + dues +
            '\nCobro por cuota: ' + div +
            '\nEsto significa que tendras una deuda de ' + amount + '  y tendrás que pagarla en ' + dues + ' cuotas de ' + div +
            '\nDeseas proceder?');
        if (result === false) {
            e.preventDefault();
        };
    });
});


