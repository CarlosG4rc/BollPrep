function doGet() {
    var template =  HtmlService.createTemplateFromFile('index'); // Método para la creación del  template
    return template.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1.0'); // se evalua la metadata de la cabecera
}
function include (filename) {
    return HtmlService.createTemplateFromFile(filename).getRawContent();
}
function uClick(infAlumno){
    var bd = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1CJ2lBb3u6RjEkpEIFTetse4DYx_7WrnwIU3dtzMyOpQ/edit#gid=752756600');
    var sheet = bd.getSheetByName(infAlumno.grupo);
    var lastrow = sheet.getDataRange().getNumRows();
    var column = sheet.getDataRange();
    var value = column.getValues();
    var alumno = infAlumno.nombre;
    
    var htmlBody_debe = HtmlService.createTemplateFromFile('mail_debe');
    htmlBody_debe.nombre = alumno;
    var email_debe = htmlBody_debe.evaluate().getContent();
          
    for(var i = 0; i < lastrow; i++)
    {
      if(value[i][1] == alumno)
      {
        var email = value[i] && value[i][3];
        var femail = value[i] && value[i][4];
        var curp = value[i] && value[i][5];
        i = lastrow + 1;
      }
    }
    if(curp == 'Aviso'){
    
          MailApp.sendEmail({
            to: email + ',' + femail,
            subject: 'Aviso de adeudo',
            htmlBody: email_debe,
            name: 'Control Escolar',
            bcc: 'cgarcia@ifp.mx'
          });
        }
    else{
          var folder = DriveApp.getFolderById('1bYdY47iIzsF2yVq7WVgUrsZVQ7LEYimq');
          var file = folder.getFilesByName(curp + '.pdf');
          if(file.hasNext()){
               MailApp.sendEmail(femail,'Boletín', 'Boletín de Calificaciones de ' + alumno,{
               attachments: [file.next().getAs(MimeType.PDF)],
               name: 'Control Escolar',
               cc: email})
          }
    }
}
function completar(){
    var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1CJ2lBb3u6RjEkpEIFTetse4DYx_7WrnwIU3dtzMyOpQ/edit#gid=752756600');
    var sheet = ss.getSheetByName('Grupos');
    var data = sheet.getRange(1,1).getDataRegion().getValues();
    var grupo = {};
    data.forEach(function(n){
        grupo[n[9]] = null;
        });
    return grupo;
}
function autocompletar(clase){
    var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1CJ2lBb3u6RjEkpEIFTetse4DYx_7WrnwIU3dtzMyOpQ/edit#gid=752756600');
    var sheet = ss.getSheetByName(clase);
    var data = sheet.getRange(1,1).getDataRegion().getValues();
    var nombre = {};
    data.forEach(function(n){
        nombre[n[1]] = null;
        });
    return nombre;
}

