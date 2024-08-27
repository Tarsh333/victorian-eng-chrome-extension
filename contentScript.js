const url = "https://api.pawan.krd/cosmosrp/v1/chat/completions";

const headers = {
    "Content-Type": "application/json",
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'transformMessage') {
        transformEmail();
    }
});

async function transformEmail() {
    // Example of transforming email content:
    const emailBody = document.querySelector('.editable'); // Adjust selector as needed
    if (emailBody) {
        const loadingIcon = '<div class="loading">Loading...</div>';
        var temp=emailBody.innerHTML;
        emailBody.innerHTML = loadingIcon;
        
        emailBody.innerHTML = `${await getConvertedMessage(temp)}`
    }
}
async function callChatGPT(prompt) {

    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: prompt },
        ],
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
        }

        const result = await response.json();
        const content = result.choices[0].message.content;
        return content;
    } catch (error) {
        console.error("Error calling ChatGPT API:", error.message);
        throw error;
    }
}
const getConvertedMessage = async (originalTxt) => {
    var convertedMessage = await callChatGPT(`You are an input output machine from now on. I'll give you input and you have to Convert the following it to Victorian English. Just return output. Nothing extra. Simply input->output. No additions or explanations or anything. Simply output. from now on. Nothing behavioural as well like 'clears throat' 'adjusts hat' etc. First input-> '${originalTxt}' `)
    return convertedMessage

}