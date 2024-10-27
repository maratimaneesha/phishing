import sys
import torch
from transformers import BertTokenizer, BertForSequenceClassification

MODEL_PATH = 'path to fine-tuned bert model'  # Update with the actual model path
TOKENIZER_NAME = 'bert-base-uncased'  # Use the pre-trained model's tokenizer

def load_model():
    model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=2)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
    tokenizer = BertTokenizer.from_pretrained(TOKENIZER_NAME)
    return model, tokenizer

def predict_spam(text):
    model, tokenizer = load_model()
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
    outputs = model(**inputs)
    _, prediction = torch.max(outputs.logits, dim=1)
    return prediction.item()

if __name__ == "__main__":
    email_content = ' '.join(sys.argv[1:])
    is_spam = predict_spam(email_content)
    print(is_spam)