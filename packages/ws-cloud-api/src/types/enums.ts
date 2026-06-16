enum InteractiveTypes {
  Button = 'button',
  CTAButton = 'cta_url',
  List = 'list',
  Flow = 'flow'
  // Product = 'product',
  // ProductList = 'product_list'
}

enum MessageTypes {
  Audio = 'audio',
  Contacts = 'contacts',
  Document = 'document',
  Image = 'image',
  Interactive = 'interactive',
  Location = 'location',
  Reaction = 'sticker',
  // Sticker = 'sticker',
  Template = 'template',
  Text = 'text',
  Video = 'video'
}

enum ParametersTypes {
  Currency = 'currency',
  DateTime = 'date_time',
  Document = 'document',
  Image = 'image',
  Text = 'text',
  Video = 'video',
  Payload = 'payload'
}

enum MessageStatus {
  Delivered = 'delivered',
  Read = 'read',
  Sent = 'sent',
  Failed = 'failed'
}

export { InteractiveTypes, MessageStatus, MessageTypes, ParametersTypes }
