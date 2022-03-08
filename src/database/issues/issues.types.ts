import { Document, Model } from 'mongoose';
import { IIssue } from '../../common/types';

export interface IIssueDocument extends IIssue, Document {};

export interface IIssueModel extends Model<IIssueDocument> {
  findByIssueId: (
    this: IIssueModel,
    issueId: string
  ) => Promise<IIssueDocument>;
  findByName: (
    this: IIssueModel,
    issueName: string
  ) => Promise<IIssueDocument>;
};
