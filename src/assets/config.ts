import { environment } from "src/environments/environment";

export class Config {
 public static BASE_URI = window.location.origin + "/";
 // public static BASE_URI = "http://localhost:8090/audit/";
    // public static BASE_URI = "http://samsungmerch.concavetech.com/";
    // public static BASE_URI = "http://pepsi.concavetech.com/";
 //   public static BASE_URI = "http://nflm.rtdtradetracker.com/";
    // public static BASE_URI = "http://culinary.concavetech.com/";
      // public static BASE_URI = "http://condiments.concavetech.com/";
  //  public static BASE_URI =  "http://daldamerch.concavetech.com/";
    // public static BASE_URI = "http://cokeaudit.concavetech.com/";
    // public static BASE_URI = "http://tapal.concavetech.com/";
    // public static BASE_URI = "http://tmr.concavetech.com/";
    //public static BASE_URI = "http://faujimerch.concavetech.com/";

   // public static BASE_URI = "http://condimentsro.concavetech.com/";
  //  public static BASE_URI = "http://culinarysro.concavetech.com/";
  //  public static BASE_URI = "http://pmiaudit.concavetech.com/";
  //  public static BASE_URI = "http://pmisheiro.concavetech.com/";

    //  public static BASE_URI = "http://pmicmb.concavetech.com/";

   //  public static BASE_URI = "https://pmirm.rtdtradetracker.com/";
   //public static BASE_URI = "http://dayfreshmerch.concavetech.com/";

      //  public static BASE_URI = "http://cbl.concavetech.com//";

    public static hash = environment.hash;
    public static main_logo = "assets/images/logo.png";
    public static login_theme_color = "green";
    public static login_logo = "assets/images/logoSmall.png";

    public static main_logo_faujimerch = "assets/images/faujiMerchLogo.png";

    public static EMPLOYEE_TYPES: Array<String> = ["MERCHANDISER", "SUPERVISOR", "PROJECT_MANAGER"];
    public static DOWNLOAD_FILE_TYPES = [
      { key: "csv", title: "CSV", icon: "fa fa-file-text-o" },
      { key: "xlsx", title: "Excel", icon: "fa fa-file-excel-o" },
    ];

  public static API_KEY = "AIzaSyDg9N44ZNw6gWSfxbsXqw5ONyEiWfL_jEY";
  public static MAPBOX_TOKEN =
    "pk.eyJ1Ijoic2FxaWJzaGVoemFkIiwiYSI6ImNsZGU1eWdqazBhYzEzdnE3cTU4Y3locmkifQ.PlqyGaCjQj7CY_y7RpIoYw";
}
