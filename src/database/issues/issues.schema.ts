import { Schema } from 'mongoose';

const IssueSchema = new Schema({
  issueId: String,
  name: String,
  description: String
});

export default IssueSchema;