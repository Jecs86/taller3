function operacionAritmetica(operacion, a, b) {
    const op = {
        "+": [a+b, "#D2E59E"],
        "-": [a-b, "#ac78beff"],
        "x": [a*b, "#E09F3E"],
        "/": [b == 0 ? NaN: a/b, "#FF729F"],
    };
    return op[operacion];
}

function diferenciaFechas(fecha1, fecha2) {
    if (!fecha1 | !fecha2) return null;
    let dtFecha1 = new Date(fecha1); 
    let dtFecha2 = new Date(fecha2);
    let diferencia = Math.abs(dtFecha1 - dtFecha2);
    return diferencia / (1000 * 60 * 60 * 24);
}

function logicaCalculadora(){
    const botones = document.querySelectorAll("#calculadora div button");
    botones.forEach( btn => {
        btn.addEventListener("click", () => {
            const n1 = parseFloat(document.getElementById("txtNumero1").value);
            const n2 = parseFloat(document.getElementById("txtNumero2").value);
            const resultado = document.getElementById("resultadoCalculadora");
            
            if (!n1 | !n2) {
                resultado.textContent = "Campos Vacios";
                return;
            }
            const [respuesta, color] = operacionAritmetica(btn.textContent, n1, n2);

            resultado.textContent = isNaN(respuesta) ? "No se puede dividir para 0": respuesta.toFixed(2);
            resultado.style.background = color;

        });
    });
}

function obtencionInputs(siValores = false) {
    const txtNombre = document.getElementById("txtNombre");
    const txtCorreo = document.getElementById("txtCorreo");
    const txtContrasena = document.getElementById("txtContrasena");
    const dtFechaNacimiento = document.getElementById("dtFechaNacimiento");
    const inputs = [txtNombre, txtCorreo, txtContrasena, dtFechaNacimiento];
    const valores = [txtNombre.value, txtCorreo.value, txtContrasena.value, dtFechaNacimiento.value]
    return siValores? valores: inputs;
} 

function logicaFormulario(){
    const btnEnviar = document.getElementById("btnEnviar");
    const [txtNombre, txtCorreo, txtContrasena, dtFechaNacimiento] = obtencionInputs();
    let siNombre = false;
    let siCorreo = false; 
    let siContrasena = false;
    let siFechaNacimiento = false;

    txtNombre.addEventListener("input", () => {
        const comprobacionNombre = document.getElementById("comprobacionNombre");
        let longitud = txtNombre.value.length;
        let mensajeLongitud = `Caracteres ${longitud}`;
        let mensaje = longitud>=3 ? "✅ ".concat(mensajeLongitud) : "❌ ".concat(mensajeLongitud);
        siNombre = longitud >=3;
        comprobacionNombre.textContent = mensaje;
    });

    txtCorreo.addEventListener("input", () => {
        const comprobacionCorreo = document.getElementById("comprobacionCorreo");
        const regexCorreo = /^([\w\.\-_]){3,}@[\w-_]{3,}(\.\w{2,}){1,}$/;
        let mensaje = regexCorreo.test(txtCorreo.value) ? "✅ Buen Correo" : "❌ Mal Correo";
        siCorreo = mensaje.includes("✅");
        comprobacionCorreo.textContent = mensaje;
    });

    txtContrasena.addEventListener("input", ()=> {
        const comprobacionContrasena = document.getElementById("comprobacionContrasena");
        let contrasena = txtContrasena.value;
        let regexDigitos = /[\d]/g;
        let regexMinuscula = /[a-z]+/g;
        let regexMayuscula = /[A-Z]+/g;
        let mensajeDigitos = regexDigitos.test(contrasena) ? "✅ 1 digito":"❌ 1 digito";
        let mensajeMinuscula = regexMinuscula.test(contrasena) ? "✅ 1 letra miniscula":"❌ 1 letra minuscula";
        let mensajeMayuscula = regexMayuscula.test(contrasena) ? "✅ 1 letra mayuscula":"❌ 1 letra mayuscula";
        let mensajeLongitud = contrasena.length >= 6 ? "✅ min 6 caracteres": "❌ min 6 caracteres";
        let mensajeCompleto = `
        <pre>
${mensajeLongitud}
${mensajeMinuscula}
${mensajeMayuscula}
${mensajeDigitos}
        </pre>
        `;
        siContrasena = mensajeDigitos.includes("✅") & mensajeMinuscula.includes("✅") & mensajeMayuscula.includes("✅") & mensajeLongitud.includes("✅");
        comprobacionContrasena.innerHTML = mensajeCompleto;
    });

    const hoy = new Date().toISOString().split("T")[0];
    dtFechaNacimiento.setAttribute("max", hoy);

    dtFechaNacimiento.addEventListener("input", () =>{
        const comprobacionFechaNaciemiento = document.getElementById("comprobacionFechaNacimiento");
        let diferenciaDias = diferenciaFechas(dtFechaNacimiento.value, hoy);
        // No toma en cuenta los días exactos, solo los años
        let diferenciaAnnio = Math.round(diferenciaDias / 365);
        let mensaje = diferenciaAnnio > 10 ? "✅ Fecha Correcta": "❌ Demasiado Joven";
        siFechaNacimiento = mensaje.includes("✅");
        comprobacionFechaNaciemiento.textContent = mensaje;
    });

    btnEnviar.addEventListener("click", e => {
        e.preventDefault();
        const [nombre, correo, contrasena, fechaNacimiento] = obtencionInputs(true);

        if (!nombre | !correo | !contrasena | !fechaNacimiento){
            alert("Campos Vacios - No se puede enviar la información");
            return;
        }
        
        if (siNombre & siCorreo & siContrasena & siFechaNacimiento){
            alert("Datos Verificados - Se envian los datos");
            const resultadosDatos = document.getElementById("resultadosDatos");
            resultadosDatos.style.background = "#8ED2C9";
            resultadosDatos.innerHTML = `
            <pre>
<strong>Datos</strong>
<strong>Nombre:</strong> ${nombre}
<strong>Correo:</strong> ${correo}
<strong>Contrasena:</strong> ${contrasena}
<strong>Fecha de Nacimiento:</strong> ${fechaNacimiento}
            </pre>
            `;
            document.getElementById("frmDatos").reset();
        }
    });
}

function logicaFechas() {
    const btnFechas = document.getElementById("btnFechas");
    
    btnFechas.addEventListener("click", ()=>{
        const fechaInicio = document.getElementById("dtFechaInicio").value;
        const fechaFin = document.getElementById("dtFechaFin").value;
        const resultadoFecha = document.getElementById("resultadoFecha");
        
        if (!fechaInicio | !fechaFin) {
            alert("Fechas Vacias");
            return;
        }

        let diferencia = diferenciaFechas(fechaInicio, fechaFin);
        resultadoFecha.textContent = `Las fechas tienen una diferencia de ${diferencia} dias`
    });
}

window.addEventListener("DOMContentLoaded", () => {
    logicaCalculadora();
    logicaFormulario();
    logicaFechas();
});