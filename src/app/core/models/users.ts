export class User {
    id: string ="";
    firstName: string ="";
    lastName: string="";
    createdDate: Date= new Date();
    email: string = "";
    profilePicUrl: string = "";

    public User(id: string, firstName: string, lastName: string, createdDate: Date,
         email: string, profilePicUrl: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.createdDate = createdDate;
        this.email = email;
        this.profilePicUrl = profilePicUrl
    }
}

export const MY_FORMATS = {
    parse: {
      dateInput: "LL",
    },
    display: {
      dateInput: "MM/DD/YY",
      monthYearLabel: "YYYY",
      dateA11yLabel: "LL",
      monthYearA11yLabel: "YYYY",
    },
  };