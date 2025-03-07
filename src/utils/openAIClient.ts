import OpenAI from 'openai';

// Initialize the OpenAI client
// Note: Replace 'YOUR_API_KEY' with your actual API key
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // This will be replaced with the actual API key
    dangerouslyAllowBrowser: true // Required for client-side usage
});

export async function sortOutputsWithAI(outputs: string[][]): Promise<string[][]> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a sorting assistant. You will receive arrays of strings representing character sequences and their counts. Sort them based on the count values in descending order."
                },
                {
                    role: "user",
                    content: `Please sort these outputs in descending order based on the count values. sort this: ${JSON.stringify(outputs)}`
                }
            ],
            temperature: 0,
        });

        const sortedOutputs = JSON.parse(response.choices[0].message.content || '[]');
        return sortedOutputs;
    } catch (error) {
        console.error('Error sorting outputs with AI:', error);
        return outputs; // Return original outputs if AI sorting fails
    }
} 