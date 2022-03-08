import { model } from 'mongoose';
import { IIssueDocument } from './issues.types';
import IssueSchema from './issues.schema';

export const IssueModel = model<IIssueDocument>('issues', IssueSchema);
