angular.module('app.form', [])
    .controller('cvForm', cvForm);

cvForm.$inject = ['masterData', 'global'];

function cvForm(masterData, global) {

    var vmForm = this;

    vmForm.init = function () {
        vmForm.consult = consult;
        vmForm.clear = clear;
        vmForm.validateNumbers = validateNumbers;
        vmForm.loading = false;
        clear();
        vmForm.clases = [{ type: "A" }, { type: "B" }, { type: "C" }, { type: "D" }];
    };


    function consult() {
        if (vmForm.creditRange.type == "") {
            vmForm.message = "Ingrese una clase de crédito.";
            return;
        }
        if (vmForm.avgOrderValue == "") {
            vmForm.message = "Ingrese un promedio de salario.";
            return;
        }
        let creditRange = vmForm.creditRange.type.toUpperCase();
        consultCredit(creditRange, vmForm.avgOrderValue);
    }

    function consultCredit(creditRange, avgOrderValue) {
        vmForm.loading = true;
        masterData.token()
            .then(function (data) {
                let token = data.headers('X-CSRF-Token');

                if (!token) {
                    vmForm.loading = false;
                    return;
                }

                let json = [
                    {
                        "__type__": "Customer",
                        "CreditRange": creditRange,
                        "AvgOrderValue": avgOrderValue
                    }
                ];
                masterData.consult(token, json)
                    .then(function (data) {
                        if (data.data[0]) {
                            let limit = data.data[0].Limit;
                            vmForm.message = "";
                            vmForm.credit = limit;
                        } else {
                            swal(
                                "Respuesta",
                                "Los datos enviados no son validos.",
                                "info"
                            );
                        }
                        vmForm.loading = false;
                    });
            });
    }


    function clear() {
        vmForm.creditRange = "";
        vmForm.avgOrderValue = "";
        vmForm.message = "";
        vmForm.credit = "";
    }

    //Validar que el input sea solo de números 
    function validateNumbers(number) {
        if (!expNumber(number)) {
            vmForm.avgOrderValue = vmForm.avgOrderValue.slice(0, -1);
        }
    }

}
