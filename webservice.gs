var service_account = JSON.parse(PropertiesService.getScriptProperties().getProperty("SERVICE_ACCOUNT"));
var project_id = '<project-id>'
var topic = '<topic-name>'
function doPost(request) {
    var data = JSON.parse(request ? request.postData.getDataAsString() : '{"message":"TEST","icon":"mail-message-new"}');
    //deep copy 
    var message = (' ' + data.message).slice(1);
    data.message = undefined;
    var service = getService();
    if (service.hasAccess()) {
        var url = "https://pubsub.googleapis.com/v1/projects/"+project_id+"/topics/"+topic+":publish";
        Logger.log(service.getAccessToken());
        UrlFetchApp.fetch(url, {
            headers: {
                Authorization: 'Bearer ' + service.getAccessToken(),
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            'method': 'post',
            payload: "{'messages':[{'data':'" + Utilities.base64Encode(message) + "','attributes':" + JSON.stringify(data) + "}]}"
        });

    }
    else {
        Logger.log(service.getLastError());
    }
    return HtmlService.createHtmlOutput().append("success")
}
function reset() {
    var service = getService();
    service.reset();
}
function getService() {
    return OAuth2.createService('PubSub')
        // Set the endpoint URL.
        .setTokenUrl('https://accounts.google.com/o/oauth2/token')

        // Set the private key and issuer.
        .setPrivateKey(service_account["private_key"])
        .setIssuer(service_account["client_email"])

        // Set the property store where authorized tokens should be persisted.
        .setPropertyStore(PropertiesService.getScriptProperties())

        // Set the scope and additional Google-specific parameters.
        .setScope([
            "https://www.googleapis.com/auth/cloud-platform",
            "https://www.googleapis.com/auth/pubsub"
        ]);
}