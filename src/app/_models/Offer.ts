export class Offer {
  constructor(
    public id: number,
    public rec_date: string,
    public client: string,
    public project_name: string,
    public description: string,
    public work_type: string,
    public quo_date: string,
    public quo_values: string,
    public quo_no: string,
    public status: string
  ) {}
}
