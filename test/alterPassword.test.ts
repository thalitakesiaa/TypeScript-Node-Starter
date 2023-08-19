import { expect } from "chai";
import { Response, Request, NextFunction } from "express";
import { postUpdatePassword } from "../src/controllers/user"; 
import { UserDocument } from "../src/models/User";
import sinon from "sinon";

// classe que implementa o tipo UserDocument para uso no stub
const user: UserDocument = {
    id: "userId",
    password: "oldPassword",
    save: (callback) => callback(null, user), // Simule o save
};

describe("postUpdatePassword function", () => {
    it("should handle password update", async () => {
        const user: UserDocument = {
            id: "userId",
            password: "oldPassword",
            save: (callback) => callback(null, user), // Simule o save
        };

        const req: Request = {
            body: {
                password: "newPassword",
                confirmPassword: "newPassword",
            },
            user,
        } as unknown as Request;

        const res: Response = {
            redirect: (url: string) => {
                expect(url).to.equal("/account");
            },
        } as unknown as Response;

        const findByIdStub = sinon.stub(UserDocument, "findById").callsFake((
            id: string,
            callback:(err: any, user: UserDocument | null) => void) => {
                // Simulando um objeto UserDocument
                callback(null, user);
            });

        const next: NextFunction = (err: any) => {
            expect(err).to.be.null;
        };

        await postUpdatePassword(req, res, next);
        
        expect(findByIdStub.calledOnce).to.be.true;
        findByIdStub.restore();


    });

});
