import { KnowledgeBaseItem } from '../types';

export const KNOWLEDGE_BASE_DATA: KnowledgeBaseItem[] = [
  // --- Adding Legal Values ---
  {
    Error: "How to add Legal Values in Production Environment?",
    RootCause: "Requirement to add new legal values for entity fields.",
    Solution: "1. Locate the batch file at `\\\\brksvw64\\f$\\CDMS\\DataLoads\\com`. \n2. Open `LegalValueLoad.txt` and enter the Legal Value to be added. \n3. Ensure `CPACDataUser.txt` contains valid Production credentials. \n4. Run the batch file `LegalValueLoadTest.bat` to add the value to CDMS Production.",
    ManagerContact: "Support Team"
  },

  // --- WSDL & Service URLs ---
  {
    Error: "What are the CE Webservice WSDL URLs?",
    RootCause: "Need WSDL for SOAP client setup.",
    Solution: "**DEV:** `http://brksvp1728.ad.navistar.com:8080/triconcewebservices/ws/IntlCEApiWebServices.wsdl`\n**STAGE:** `http://brksvp1700.ad.navistar.com:8080/triconcewebservices/ws/IntlCEApiWebServices.wsdl`\n**TEST:** `http://brksvp1737.ad.navistar.com:8080/triconcewebservices/ws/IntlCEApiWebServices.wsdl`\n**SUPPORT:** `http://brksvp2172.ad.navistar.com:8080/triconcewebservices/ws/IntlCEApiWebServices.wsdl`\n**PRODUCTION:** `http://brksvp2171.ad.navistar.com:8080/triconcewebservices/ws/IntlCEApiWebServices.wsdl`",
    ManagerContact: "Support Team"
  },
  {
    Error: "What are the MTC CE Web Service WSDL URLs?",
    RootCause: "Need MTC WSDL for integration.",
    Solution: "**DEV:** `http://brksvp1744.ad.navistar.com:8080/triconcewebservices/ws/IntlCEApiWebServices.wsdl`\n**TEST:** `http://brksvp1737.ad.navistar.com:8080/triconcewebservices/ws/IntlCEApiWebServices.wsdl`\n**PRODUCTION:** `http://brksvp2164.ad.navistar.com:8080/triconcewebservices/ws/IntlCEApiWebServices.wsdl`",
    ManagerContact: "Support Team"
  },

  // --- Coding Orders: Jeff Client ---
  {
    Error: "How to code EOFF orders in Jeff Client?",
    RootCause: "Need to code orders via Jeff Client.",
    Solution: "1. **Setup:** Jeff Client is on `BRKSVW221` at `F:\\FromTrigent\\Jeff_Client`. \n2. **Input:** Place the order `.txt` file in `F:\\FromTrigent\\Jeff_Client\\Input` (Ensure no other txt files exist). \n3. **Execution:** Open CMD, navigate to the folder, and run `StartJeffClient_prod64.bat`. \n4. **Output:** Check `F:\\FromTrigent\\Jeff_Client\\Output_64\\Prod` for `.msg` and `.out` files.",
    ManagerContact: "Support Team"
  },

  // --- Coding Orders: Soap UI ---
  {
    Error: "How to code orders in Soap UI?",
    RootCause: "Testing order coding via SOAP API.",
    Solution: "1. Create new SOAP Project in SoapUI. \n2. Enter WSDL URL (e.g., `http://brksvp1700.../IntlCEApiWebServices.wsdl`). \n3. Double-click the request. \n4. Replace `IntlInputOrder` with EOFF order string. \n5. Replace `IntlProcessingRequest` with transaction details. \n6. Set `IntlFormatIdentifier` to `F2`. \n7. Run request. Failure responses may indicate missing fields or invalid values.",
    ManagerContact: "Support Team"
  },

  // --- Coding Orders: Windows Client ---
  {
    Error: "How to code orders using Windows Client (codeOrderUsingCodingService)?",
    RootCause: "Batch processing of EOFF orders.",
    Solution: "1. **Location:** `\\\\brksvp1700\\f$\\CE\\WebServiceClient`. \n2. **Input:** Place `.ORDERS` files in the Input folder (Use `SplitOrder.bat` if needed). \n3. **Execution:** Run `codeOrderUsingCodingService.bat` from Command Prompt. \n4. **Output:** Check `F:\\CE\\WebServiceClient\\OutputOrder` for output and message files.",
    ManagerContact: "Support Team"
  },

  // --- Control M Jobs ---
  {
    Error: "What is the PSENGT01 Job?",
    RootCause: "Job Information.",
    Solution: "**Function:** Loads item counts into Engine (tcp_facts.UNL_DAT). \n**Machine:** BRKSVP2409. \n**Schedule:** 15:30 CST. \n**Process:** Runs `psengt01.bat` -> `DumpItemCount.pl` to pull data from MySQL.",
    ManagerContact: "Trigent Support"
  },
  {
    Error: "What is the PSENGT83 Job?",
    RootCause: "Job Information.",
    Solution: "**Function:** Kicks off the CE Builder (Most important job). \n**Machine:** BRKSVP2170. \n**Schedule:** ~18:30 CST. \n**Predecessor:** PSENGT82. \n**Process:** Invokes DFU, then CEBuilder to make full engine build (approx 1.5 hours).",
    ManagerContact: "Trigent Support"
  },
  {
    Error: "What is the PSENGT84 Job?",
    RootCause: "Job Information.",
    Solution: "**Function:** Copies CE Data to folders and runs Interim Builder. \n**Machine:** BRKSVP2170. \n**Schedule:** ~19:30 CST. \n**Predecessor:** PSENGT83.",
    ManagerContact: "Trigent Support"
  },
  {
    Error: "What is the PSENGV0H Job?",
    RootCause: "Job Information.",
    Solution: "**Function:** Stops the EOFF queue from coding orders. \n**System:** VMS cccpa3/cccpa4. \n**Predecessor:** PSENGT84. \n**Note:** Has exit command. Hold this job to stop EOFF coding if needed.",
    ManagerContact: "Trigent Support"
  },
  {
    Error: "What are the Verification Jobs (PSENGT86, 87, 88)?",
    RootCause: "Job Information.",
    Solution: "**Function:** Verifies the Engine Build for CE01, CE02, CE03 respectively. \n**Process:** Runs `verify_engine.bat`. Starts servers, processes sample verification orders (`VALSELCOM`), stops servers, and runs `ce_validate.pl`. \n**Success Criteria:** Error count <= 4 per Engine.",
    ManagerContact: "Trigent Support"
  },

  // --- ServiceNow Tickets: Property Files ---
  {
    Error: "How to create a ticket to change Property files in ServiceNow?",
    RootCause: "Need to update application.properties or kodo.properties in Non-Prod environments.",
    Solution: "1. Login to ServiceNow -> Service Catalog -> Requests. \n2. **Assignment Group:** `I-NAV-APPS-WEBSPHERE`. \n3. **Short Desc:** Request to replace application.properties (Env, Node). \n4. **Desc:** Specify Environment (DEV, STAGE, etc.) and Nodes. Provide location of modified file (e.g., `\\\\brksvp754\\f$\\share\\Cdms\\...`). \n5. Email ticket details to DBA team (`ITAESWebsphereDeployments@international.com`, etc).",
    ManagerContact: "I-NAV-APPS-WEBSPHERE"
  },

  // --- ServiceNow Tickets: EAR Deployment ---
  {
    Error: "How to create a ticket for EAR Deployment?",
    RootCause: "Auto-deployment unavailable or special request for Test/Support/Prod.",
    Solution: "1. Login to ServiceNow -> Request Task. \n2. **Assignment Group:** `I-NAV-APPS-WEBSPHERE`. \n3. **Short Desc:** Request to deploy [EAR Name] in [Env]. \n4. **Desc:** Details of Env, Nodes (e.g., BRKSVPL437), and location of `.ear` file (e.g., `\\\\brksvp754\\f$\\share\\Cdms\\...`).",
    ManagerContact: "I-NAV-APPS-WEBSPHERE"
  },

  // --- ServiceNow Tickets: DB Scripts ---
  {
    Error: "How to create a ticket to apply DB Scripts?",
    RootCause: "Need to run SQL scripts in DB.",
    Solution: "1. Login to ServiceNow -> Request Task. \n2. **Assignment Group:** `I-NAV-DBA-ORACLE` (for Oracle). \n3. **Short Desc:** Apply DB Script for [Database Name] [With/Without Refresh]. \n4. **Desc:** Specify Env, Database Name (e.g., PSD01, PSS02), and script location (`\\\\brksvp754\\f$\\share\\Cdms\\...`). \n5. Email ticket to `dbaoracle@international.com`.",
    ManagerContact: "I-NAV-DBA-ORACLE"
  },

  // --- Propshaft Creation ---
  {
    Error: "How to create Propshaft in CDMS Prod?",
    RootCause: "Request to create BOM Records for Propshaft.",
    Solution: "1. Create a text file with part numbers at `\\\\brksvw64\\f$\\CDMS\\Propshafts\\data`. \n2. Run script `CreatePropsByList.bat` from `\\\\brksvw64\\f$\\CDMS\\Propshafts\\com` passing the filename as an argument. \n**Note:** Use for < 5 parts.",
    ManagerContact: "Support Team"
  },

  // --- Log Extraction ---
  {
    Error: "How to extract logs from Production or Non-Production?",
    RootCause: "Need to analyze system or application logs.",
    Solution: "1. Use **WinSCP**. \n2. **Host:** Environment Node IP/Hostname (e.g., `BRKSVPL437`). \n3. **User:** SSH Username. \n4. **Path:** Navigate to `/websphere/apps/logs/CDMS` or `/websphere/WAS85.../logs`. \n5. Drag and drop `SystemErr.log`, `SystemOut.log`, or app logs to local machine.",
    ManagerContact: "Support Team"
  },

  // --- Contact Teams ---
  {
    Error: "Who are the contact points for different teams?",
    RootCause: "Need to escalate or assign tickets.",
    Solution: "**DBA Oracle:** Tanmai Hada (`dbaoracle@international.com`) \n**DBA SQL:** Chandramouli Sangam \n**Websphere:** Hong Liao (`ITAESWebsphereDeployments@...`) \n**Windows:** Arun Ammanoor Kumar \n**TruckPerfect:** William Headrick (`william.headrick@certusoft.com`) \n**VEI:** William Thomas Reynolds (`VEIITTechnical@navistar.com`)",
    ManagerContact: "See Solution"
  },

  // --- Parallel Order Coding ---
  {
    Error: "How to perform Parallel Order Coding Testing?",
    RootCause: "Compare order coding between environments.",
    Solution: "1. Access `BRKSVP652` (`\\\\brksvp652\\f$\\CE64_Parallel_Coding_Txn_Data`). \n2. Open `Parallel Coding ResultsB.xls`. \n3. In 'Cfg' page, set previous dates to 'Folder Not Found'. \n4. Click 'Macro' to start comparison. \n5. Review the generated page for Diff details and click hyperlinks to view specific file differences.",
    ManagerContact: "Support Team"
  },

  // --- Incident Management ---
  {
    Error: "How to resolve P2, P3, and P4 Incident Tickets?",
    RootCause: "Ticket resolution process.",
    Solution: "1. **Assign:** Assign ticket to self in ServiceNow. Change state to 'In Progress'. \n2. **Analyze:** Determine root cause. \n3. **Resolution:** Update 'Resolution Code', 'Resolve by', 'Category'. \n4. **Notes:** Update 'Technical Resolution Notes' and 'Impacted Configuration Item'. \n5. **Close:** Change state to 'Resolved'.",
    ManagerContact: "Support Team"
  },

  // --- Restarting Servers ---
  {
    Error: "How to restart Application and IHS Servers?",
    RootCause: "Application hung or deployment requires restart.",
    Solution: "1. **Dev/Stage:** Login to IBM Websphere Console. \n   - **Applications:** Applications -> Enterprise Applications -> Select App -> Stop/Start. \n   - **Servers:** Servers -> Server Types -> Websphere Application Servers -> Select Server -> Stop/Start. \n2. **Test/Support/Prod:** Cannot restart manually. Create ticket to AES Websphere Team.",
    ManagerContact: "I-NAV-APPS-WEBSPHERE"
  },

  // --- Engine Rollback & Troubleshooting ---
  {
    Error: "What are the common issues causing Engine Rollback?",
    RootCause: "Engine validation failed (Error count > 4).",
    Solution: "**1. Completeness Issue:** Feature not in Assembly Group. Check `cce_validate_out.txt` and CDMS Completeness UI. \n**2. Validation Rule Issue:** Rejection rule triggered. Check clause in `cce_validate_out.txt`. \n**3. TruckPerfect Issue:** Driveline logs error. Check logs at `\\\\brksvp2170\\f$\\Program Files\\TCPCE\\Server\\log`. Restart TP servers via ticket if needed. \n**4. VEI Issue:** VEI logs error. Check logs at same path. Restart VEI via ticket.",
    ManagerContact: "Trigent Support / Impacted Team"
  },
  {
    Error: "How to troubleshoot TruckPerfect or VEI errors?",
    RootCause: "Engine rollback due to external service failure.",
    Solution: "1. Check logs at `\\\\brksvp2170\\f$\\Program Files\\TCPCE\\Server\\log`. \n2. If timeout/no response, create **Serv2 Ticket**: \n   - **TruckPerfect:** Assign to `C-NAV-IPD-TRUCKPERFECT`. \n   - **VEI:** Assign to `C-NAV-APPS-VEI`. \n3. Ask them to restart services. \n4. Rerun verification jobs (PSENGT86/87/88) after confirmation.",
    ManagerContact: "William Headrick (TP) / William Thomas Reynolds (VEI)"
  }
];