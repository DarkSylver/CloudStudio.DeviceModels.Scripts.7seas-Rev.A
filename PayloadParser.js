function parseUplink(device, payload) {
    var data = payload.asString();
    env.log("Received data: ", data);

    if (!data.startsWith("$GPRMC")) return;

    var parts = data.split(',');

    if (parts.length < 13) {
        env.log("Formato inválido.");
        return;
    }

    // Conversión de coordenadas a decimal
    function convertToDecimal(coord, direction) {
        var deg, min;
        if (direction === 'N' || direction === 'S') {
            deg = parseInt(coord.substring(0, 2));
            min = parseFloat(coord.substring(2));
        } else {
            deg = parseInt(coord.substring(0, 3));
            min = parseFloat(coord.substring(3));
        }
        var dec = deg + min / 60;
        if (direction === 'S' || direction === 'W') dec *= -1;
        return dec;
    }

    // Parseo de campos
    var lat = convertToDecimal(parts[3], parts[4]);
    env.log (lat);
    var lon = convertToDecimal(parts[5], parts[6]);
    env.log (lon);
    var velocidad = parseFloat(parts[7]) * 1.852; // nudos a km/h
    var rumbo = parseFloat(parts[8]);
    var variacion = parseFloat(parts[10]);
    if (parts[11] === 'W') variacion *= -1;

    // Timestamp GPS (fecha + hora)
    var fecha = parts[9]; // ddmmyy
    var hora = parts[1];  // hhmmss.sss
    var datetimeString = "20" + fecha.substring(4,6) + "-" + fecha.substring(2,4) + "-" + fecha.substring(0,2)
                       + "T" + hora.substring(0,2) + ":" + hora.substring(2,4) + ":" + hora.substring(4,6) + "Z";
    var timestamp = new Date(datetimeString);
    env.log(timestamp);

    // Actualización de endpoints

    // Localización
    if (lat != null && lon != null && !isNaN(timestamp.getTime())) {
        var eplt = device.endpoints.byType(endpointType.locationTracker);
        if (eplt != null) {
            eplt.updateLocationTrackerStatus(lat, lon, 0, locationTrackerFlags.none, timestamp);
        }
    }

    // Velocidad
    if (!isNaN(velocidad)) {
        var epv = device.endpoints.byAddress("2");
        if (epv != null)
            epv.updateGenericSensorStatus(velocidad, timestamp);
    }

    // Rumbo
    if (!isNaN(rumbo)) {
        var epr = device.endpoints.byAddress("3");
        if (epr != null)
            epr.updateGenericSensorStatus(rumbo, timestamp);
    }

    // Variación magnética
    if (!isNaN(variacion)) {
        var epvm = device.endpoints.byAddress("4");
        if (epvm != null)
            epvm.updateGenericSensorStatus(variacion, timestamp);
    }
}


function buildDownlink(device, endpoint, command, payload) 
{ 
	// Esta función permite convertir un comando de la plataforma en un
	// payload que pueda enviarse al dispositivo.
	// Más información en https://wiki.cloud.studio/page/200

	// Los parámetros de esta función, son:
	// - device: objeto representando el dispositivo al cual se enviará el comando.
	// - endpoint: objeto endpoint representando el endpoint al que se enviará el 
	//   comando. Puede ser null si el comando se envía al dispositivo, y no a 
	//   un endpoint individual dentro del dispositivo.
	// - command: objeto que contiene el comando que se debe enviar. Más
	//   información en https://wiki.cloud.studio/page/1195.

	// Este ejemplo está escrito asumiendo un dispositivo que contiene un único 
	// endpoint, de tipo appliance, que se puede encender, apagar y alternar. 
	// Se asume que se debe enviar un solo byte en el payload, que indica el tipo 
	// de operación.

/*
	 payload.port = 25; 	 	 // Este dispositivo recibe comandos en el puerto LoRaWAN 25 
	 payload.buildResult = downlinkBuildResult.ok; 

	 switch (command.type) { 
	 	 case commandType.onOff: 
	 	 	 switch (command.onOff.type) { 
	 	 	 	 case onOffCommandType.turnOn: 
	 	 	 	 	 payload.setAsBytes([30]); 	 	 // El comando 30 indica "encender" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.turnOff: 
	 	 	 	 	 payload.setAsBytes([31]); 	 	 // El comando 31 indica "apagar" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.toggle: 
	 	 	 	 	 payload.setAsBytes([32]); 	 	 // El comando 32 indica "alternar" 
	 	 	 	 	 break; 
	 	 	 	 default: 
	 	 	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 	 	 break; 
	 	 	 } 
	 	 	 break; 
	 	 default: 
	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 break; 
	 }
*/

}