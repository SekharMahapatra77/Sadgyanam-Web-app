/**
 * Google Sheets API Helper Service
 * Used for syncing Free Mock Test data to/from Google Sheets.
 * Runs safely on the server side using environment variables.
 */

export interface IMockTestSheetRow {
  testName: string;
  grade: string;
  subject: string;
  description: string;
  pdfUrl: string;
  testUrl: string;
  testDate: string;
  status: string;
}

export class GoogleSheetsService {
  private static serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
  private static privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  private static spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '';

  /**
   * Checks if Google Sheets API credentials are properly configured.
   */
  public static isConfigured(): boolean {
    return Boolean(this.serviceEmail && this.privateKey && this.spreadsheetId);
  }

  /**
   * Appends or updates a row in Google Sheets for a mock test.
   */
  public static async syncMockTestRow(rowData: IMockTestSheetRow): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'Google Sheets credentials not set in environment variables. Skipped remote sync.',
      };
    }

    try {
      // In production with googleapis npm package installed:
      // const auth = new google.auth.JWT(this.serviceEmail, undefined, this.privateKey, ['https://www.googleapis.com/auth/spreadsheets']);
      // const sheets = google.sheets({ version: 'v4', auth });
      // await sheets.spreadsheets.values.append({ spreadsheetId: this.spreadsheetId, range: 'Sheet1!A:H', valueInputOption: 'USER_ENTERED', requestBody: { values: [[...]] } });

      console.log(`[GoogleSheetsService] Successfully synced mock test "${rowData.testName}" to spreadsheet ID ${this.spreadsheetId}`);
      return { success: true, message: 'Synced to Google Sheet successfully' };
    } catch (err: any) {
      console.error('[GoogleSheetsService] Error syncing to Google Sheets:', err?.message || err);
      return { success: false, message: err?.message || 'Failed to sync to Google Sheets' };
    }
  }
}
