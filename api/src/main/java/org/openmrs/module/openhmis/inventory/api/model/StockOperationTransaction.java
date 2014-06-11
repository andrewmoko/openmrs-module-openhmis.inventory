package org.openmrs.module.openhmis.inventory.api.model;


import org.openmrs.Patient;

public class StockOperationTransaction extends TransactionBase {
	public static final long serialVersionUID = 0L;

	private Stockroom stockroom;
    private Institution institution;
    private Patient patient;

	public StockOperationTransaction() {	}

	public StockOperationTransaction(TransactionBase tx) {
		super(tx);
	}

	public Stockroom getStockroom() {
		return stockroom;
	}

	public void setStockroom(Stockroom stockroom) {
		this.stockroom = stockroom;
	}

    public Institution getInstitution() {
        return institution;
    }

    public void setInstitution(Institution institution) {
        this.institution = institution;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
