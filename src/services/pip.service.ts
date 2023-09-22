import { PDPAction, AuthorizationPolicy } from './pdp.service';
import { Request } from 'express';

// Policy Information Point
class PIPService {
  private static instance: PIPService;

  private constructor() {
    // Initialize the singleton, if needed
  }

  public static getInstance(): PIPService {
    if (!PIPService.instance) {
      PIPService.instance = new PIPService();
    }
    return PIPService.instance;
  }

  public buildAuthenticationPolicy(req: Request): AuthorizationPolicy {
    // Get URL segments to build the policy
    const urlSegments = req.url.split('/');
    // Create an authorization policy based on request information
    const policy: AuthorizationPolicy = {
      subject: urlSegments[1],
      action: req.method as PDPAction,
      conditions: {},
    };
    // Temporary conditions
    policy.conditions =
      policy.subject === 'user'
        ? {
            task: urlSegments[2],
          }
        : policy.subject === 'contract'
        ? {
            participant: 'admin',
          }
        : {};
    // Return the constructed authorization policy
    return policy;
  }
}

export default PIPService.getInstance();
