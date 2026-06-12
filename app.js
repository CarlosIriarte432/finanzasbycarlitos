import {
    auth,
    db,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    onAuthStateChanged
}
from "./firebase.js";

let movimientos = [];

const form = document.getElementById("movimientoForm");
const tabla = document.getElementById("tablaMovimientos");

const totalIngresos = document.getElementById("totalIngresos");
const totalGastos = document.getElementById("totalGastos");
const saldo = document.getElementById("saldo");

const filtroMes =
    document.getElementById("filtroMes");

const cantidadMovimientos =
    document.getElementById("cantidadMovimientos");

const promedioGasto =
    document.getElementById("promedioGasto");

const toggleResumen =
    document.getElementById("toggleResumen");

const resumenContenido =
    document.getElementById("resumenContenido");

const mesesTexto = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        if (!auth.currentUser) {

            alert(
                "Debe iniciar sesión para guardar movimientos."
            );

            return;
        }

        const descripcion =
            document.getElementById("descripcion")
            .value.trim();

        const monto =
            Number(
                document.getElementById("monto")
                .value
            );

        const tipo =
            document.getElementById("tipo")
            .value;

        if (!descripcion || monto <= 0) {

            alert(
                "Ingrese un monto válido."
            );

            return;
        }

        const hoy =
            new Date();

        const fecha =
            hoy.toLocaleDateString("es-CL");

        const mes =
            `${hoy.getFullYear()}-${String(
                hoy.getMonth() + 1
            ).padStart(2, "0")}`;

        const movimiento = {

            descripcion,
            monto,
            tipo,
            fecha,
            mes

        };

        try {

            await guardarMovimientoFirestore(
                movimiento
            );

            await cargarMovimientos();

            form.reset();

        } catch (error) {

            console.error(error);

            alert(
                "Error al guardar movimiento."
            );
        }
    }
);

async function guardarMovimientoFirestore(
    movimiento
) {

    const user =
        auth.currentUser;

    await addDoc(

        collection(
            db,
            "usuarios",
            user.uid,
            "movimientos"
        ),

        movimiento

    );
}

async function cargarMovimientos() {

    const user =
        auth.currentUser;

    if (!user) {

        movimientos = [];

        filtroMes.innerHTML =
            '<option value="todos">Todos los meses</option>';

        renderizar();

        return;
    }

    const snapshot =
        await getDocs(

            collection(
                db,
                "usuarios",
                user.uid,
                "movimientos"
            )

        );

    movimientos =
        snapshot.docs.map(
            documento => ({

                firestoreId:
                    documento.id,

                ...documento.data()

            })
        );

    cargarMeses();

    renderizar();
}

function cargarMeses() {

    const mesesUnicos =
        [...new Set(
            movimientos.map(
                m => m.mes
            )
        )];

    const actual =
        filtroMes.value;

    filtroMes.innerHTML =
        '<option value="todos">Todos los meses</option>';

    mesesUnicos
        .sort()
        .reverse()
        .forEach(mes => {

            const [anio, numeroMes] =
                mes.split("-");

            filtroMes.innerHTML += `
                <option value="${mes}">
                    ${mesesTexto[
                        Number(numeroMes) - 1
                    ]} ${anio}
                </option>
            `;
        });

    filtroMes.value =
        mesesUnicos.includes(actual)
            ? actual
            : "todos";
}

function renderizar() {

    tabla.innerHTML = "";

    let ingresos = 0;
    let gastos = 0;

    const mesSeleccionado =
        filtroMes.value;

    const movimientosFiltrados =
        mesSeleccionado === "todos"
            ? movimientos
            : movimientos.filter(
                m => m.mes === mesSeleccionado
            );

    movimientosFiltrados.forEach(
        movimiento => {

            if (
                movimiento.tipo === "ingreso"
            ) {

                ingresos += movimiento.monto;

            } else {

                gastos += movimiento.monto;
            }

            const fila =
                document.createElement("tr");

            fila.innerHTML = `
                <td>${movimiento.descripcion}</td>

                <td class="${
                    movimiento.tipo === "ingreso"
                    ? "ingreso-texto"
                    : "gasto-texto"
                }">
                    ${movimiento.tipo}
                </td>

                <td>${movimiento.fecha}</td>

                <td>
                    $${movimiento.monto
                        .toLocaleString("es-CL")}
                </td>

                <td>
                    <button
                        class="delete-btn"
                        onclick="eliminar('${movimiento.firestoreId}')">
                        Eliminar
                    </button>
                </td>
            `;

            tabla.appendChild(
                fila
            );
        }
    );

    totalIngresos.textContent =
        "$" +
        ingresos.toLocaleString(
            "es-CL"
        );

    totalGastos.textContent =
        "$" +
        gastos.toLocaleString(
            "es-CL"
        );

    const saldoActual =
        ingresos - gastos;

    saldo.textContent =
        "$" +
        saldoActual.toLocaleString(
            "es-CL"
        );

    saldo.style.color =
        saldoActual >= 0
            ? "#22c55e"
            : "#ef4444";

    cantidadMovimientos.textContent =
        `Movimientos: ${movimientosFiltrados.length}`;

    const soloGastos =
        movimientosFiltrados.filter(
            m => m.tipo === "gasto"
        );

    const promedio =
        soloGastos.length
            ? soloGastos.reduce(
                (a, b) => a + b.monto,
                0
            ) / soloGastos.length
            : 0;

    promedioGasto.textContent =
        `Gasto promedio: $${Math.round(
            promedio
        ).toLocaleString("es-CL")}`;
}

async function eliminar(id) {

    const confirmar =
        confirm(
            "¿Está seguro de que desea eliminar este movimiento?"
        );

    if (!confirmar) {
        return;
    }

    const user =
        auth.currentUser;

    if (!user) {
        return;
    }

    try {

        await deleteDoc(

            doc(
                db,
                "usuarios",
                user.uid,
                "movimientos",
                id
            )

        );

        await cargarMovimientos();

    } catch (error) {

        console.error(error);

        alert(
            "Error al eliminar."
        );
    }
}

window.eliminar =
    eliminar;

toggleResumen.addEventListener(
    "click",
    () => {

        resumenContenido.classList.toggle(
            "oculto"
        );

        const oculto =
            resumenContenido.classList.contains(
                "oculto"
            );

        localStorage.setItem(
            "resumenOculto",
            oculto
        );

        toggleResumen.textContent =
            oculto
                ? "Mostrar"
                : "Ocultar";
    }
);

const resumenOculto =
    localStorage.getItem(
        "resumenOculto"
    ) === "true";

if (resumenOculto) {

    resumenContenido.classList.add(
        "oculto"
    );

    toggleResumen.textContent =
        "Mostrar";
}

filtroMes.addEventListener(
    "change",
    renderizar
);

onAuthStateChanged(
    auth,
    async () => {

        await cargarMovimientos();
    }
);