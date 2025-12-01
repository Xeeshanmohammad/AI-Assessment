
async function triggerAzureLogicApp(reportData) {

  console.log("Azure Logic App triggered with report:", reportData);
  return { status: "triggered", timestamp: new Date().toISOString() };
}

module.exports = { triggerAzureLogicApp };
